"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

/**
 * PixelPortrait — the hero portrait as pixel data. 96 x 144 cells, 15-colour
 * palette, run-length encoded, no dependencies and no image request.
 *
 * The data is decoded once into an ImageData buffer and blitted to a canvas at
 * 8x with smoothing off, so it stays crisp at any CSS size. 13,824 cells is
 * well past the point where one <div> per pixel starts costing layout time.
 *
 * Two states: greyscale at rest, full colour on hover or focus. Both are real
 * renders of the same pixel data through different palettes, stacked and
 * cross-faded, so the greys are tunable rather than whatever CSS filter()
 * happens to give.
 *
 * Departure from the source file: the cross-fade was a 420ms cubic-bezier.
 * Constraint #4 is steps() only — nothing in this system interpolates — so it
 * now steps across `frames` frames of --f. Four discrete opacity levels reads
 * as a dissolve rather than a fade, which is the point.
 */

export const PORTRAIT_WIDTH = 96;
export const PORTRAIT_HEIGHT = 144;

/** Index order matters: it is what PORTRAIT_PIXELS refers to. */
export const PORTRAIT_PALETTE = [
  "#ffffff",
  "#121315",
  "#262524",
  "#f2ece8",
  "#010101",
  "#f99b4d",
  "#f4b97c",
  "#1d1916",
  "#c56f30",
  "#050403",
  "#3b322b",
  "#77604e",
  "#0c0d0d",
  "#623f27",
  "#d1925e",
];

/**
 * Run-length encoded, row-major. An uppercase letter A–O selects a palette
 * index; the base-36 digits that follow are the run length (absent = 1).
 */
export const PORTRAIT_PIXELS =
  "AzAzAzAzAzAzAzAzAzAzAzAzAoDAzAuDAhDA4DAzAzAhDADA2D2AeDAzAmDAaDAcDADA7DA6DAzAdDAcDA4DEJA3DAJA4DA2DADA" +
  "DADADAzAuDA2DJ2L3NLADLNJ2MA3DADA5DADAzApDA5DML2NC3NMDMBL3JA5J3DA6DA5DAzAdDADA5ON4BJEMCKJNKMCL2JA3ML4" +
  "JA2DA3DA2DAzA2DAbDADA3DA2LNCHMEJBJ2MNKJ2KHCLMACLKBHKNJA4DADAzAdDA6LNLMJNKJEL2NKE2JKJCJ2HJKHJLNHCJBKM" +
  "A8DAzA9DA7ML2K2NHM2LNCMCMEHJCE2MEJHEJNHEJCEBLJAJ2A3DA2DA2DAzA3DA2DA5MLCJMCKHMNCBEMN2E2BNJEJHJEKCEJC2" +
  "NCHNBL2NDA2D2ADAzA2DA4DA4DMENJ2EJHM2HBEJHC2HLKCNLE2JC2HJKHBKN2HKCKLJA4DADAzDA2DADA5NLJCJNKHJEJ2NCJEM" +
  "BJKJNK2NEHCEJKM2EKCEHE2HKLA4DADAzA2DADA5L2H2ELC2HEJLNH2CNJECEMJNHCEHE3MBE2ME4HECNEJA3DAxDA3DA5MJ2MNC" +
  "ELCJHCHN2CHMCKNCE2HENCBE2HNJE2M2EKN2JEMHCHNJA4DADAvD2A5JL2N2CJ2KC2E2N2CH3JH2KHE2MKHJE3HNMEHEHCMKNE2J" +
  "HBCLJA2DADADArDADA3DA3LNHCKMCJNHJE2NC2MJ2MEJCHEJKH2E2JHN2HKEH2JBJKE2HNEMKHA3DADADAoDA4DA3DA2NHMEHEJE" +
  "JKHBEKCJME3JEM2ECMHE3HKCHJCEHJCE2HEBKE2BHNA4DA2DAqDADA2DA3LNHJE4HJEBHBJH2M2E4JE2JHJE4HBE2CE4CEJE3KJE" +
  "CLJA5DAsDA2DA3DNHJMNKEN2KCHJMEJKCMBE4JLKCNHE5JBHE2BEBJE2HCKNEHJLJDA2DADAsDA3OMKB2JNCJNKJBMHME2N2H2JE" +
  "4NKN2HNKE2J3HJE3JH2JE2HKMECK2LNDA4DApDA5KLH2JLCJLCE3MHMEJLCHME3JCN2CJCHCKEJNMEJHE3HBCJEJBKCJKJHLHA3D" +
  "ArDA4NKJEK2J2LCJNBEJEJCKCBJEH2JKCHJBJH3JNMJ2H2CE3HEHNE2HNM2EMCKA2DArDA3DADKMKCMCJENH2E5MNHE2HCBEKHJB" +
  "JE2HEK3CBEH2CE4MHKEBJNEHKJAwDA5KENBJNHJEKJEKCMEJCHJNKHJEMJHE6KNEJHEJB2NEJHJCNE2C2EMCKADA3DAnDA8KLCHJ" +
  "EMHE2NKHM2HJMHBNKME2K2E7CHE5B2NE2HCNJE2HE2JHN2DADA3DAnDA5DNCMJHJNHJLKE3HNHME2NKHMJNCJHEHE2HE2JHCE2H2" +
  "EHE5HE2HEBJHNHA2DADAmDA2DA4DHKH2ELCENKME3CBHME2HKCE2CH2JBCE2HE2BH2CE5HJE2H2KEBMEMHKMA5DAkDADA6HKCJEN" +
  "C2JLNME2KJE4MEMH2EMC2H2E2HJ2CE2BCKE2H3KE2JH2NJEMNJAvDA4HLCMJHNCHJ2NKNKHJEMJ2NHJE2JHJEJ2E2JHE4BKNEHJK" +
  "MKE2M2CHNEBHNJArDADA2DADHLHENJNBE3JNCHJE2HJ2N3J2N2E3HE7MHKE3H2KJE3HMCNEHJN2DArDA2DA3HNHEKBEHJME7MHKE" +
  "N2JMI2J2H2CE3BEJBCKEHJEBHKE5CNE3HJNCA6DADApLK2MJCE2HE2BHE3HENHMILJF2HMKHMH2EHE3HE3NHEJHKE2HJCKE3J3C2" +
  "A7DAkDA6DJKHJEBME2HBHEBMHJ2IFIMFOMIMHJ2H2EH2E3JKJKMHE6CE3JHJCNLA6DAkDA2DA5GLKCBJCHECBJEHBHNIFI2FJNFK" +
  "H3JEJ3NMHJHMH2IE3H2E6HEHNJAtDA7GKCHCE2NHCME2BHMIFOFG2FLNH2CHBJNCIJN2MECJI2JNE2JCJE2BEKHNMDA4DAqDA4DL" +
  "CJ2EHJ2CME2H4I2FG5IHKHMHNINIKI3J2NJNIH2E2JHMEMHBMJNHA3DADAgDA5DADA5DLKEJE2H2JE3HKN2IFG6FINI3F6IKH2NI" +
  "2FIKJE2HCEJCJEBHDA4DAoDA7KC3HE2H2E3NI4G9FIF3GONCB2JMHCKF3HE3ME6H2KAuDADA5GJCJE2HJ2E2IF2K3C2BHKIFG3F3" +
  "NHMJ5BMKLF2INE5MEHJCMDA4DAqDA7MKBE2KHJEJF2K2CMJM3N2KI2O2IHNKCH3N2I4LF2IME3HMJKEJDA4DApD2ADA6K2HME2CH" +
  "EJFO3I2KH2JKN2IFGF2INH3J3HKNI3N3HE3H2JE2HGAzA6J2CE3HJMG2F2N2IH3KN3IGFI2NH2KBJEHJKNI2M2I2EJE2ME2BKMA5" +
  "DAnDADAbBE4J2GF2N2M2J2EKN2IKOIMN3KOKH2ONKNIFNF3EJHINIEJ2DAuDA2DA9JEMJELCF3NMLDH3LHI2HGFIN3I6N2IF2IF3" +
  "E2IFNIEMA6DAqD2ADA9JINJEJFGF2I2OI4NILKG2FHN2I2N4I2F7JEHFIFEHA7DAoDA2DAaJGIFJEG4FI4N2F2KIG2FN2I3F6GFG" +
  "F4J2HIF2JHA6DA4DA2DAiDA2DA9MGF2EHG6FIF3G2NFG2I2NI2F5G3FGF4JFKNFJHDA3DAuDAcOGIJFG8FG4FG3FI4F2G6FOF4KF" +
  "HIFEBNA6DA3DAnDAcMGINHOGbOFG3FI2NIF2G6FIF4H2NF2MJDA4DAsDA3DA9DLGINFGbF2G3F2IN2F2G5O2F4IJNF2J2HAzDAdM" +
  "GIJFOG9F2G2DG2F3I2L6GF5IMIF2EBNKA4DADA3DAzA2JF2IFG2OLO5F2G5F4I2FG5F6IKF2JEJMA8DAoDA2DAdKGFJG8F4I2F2I" +
  "J2I3FG6F4I2CIJEMKDAzAfJG2MGbINMN3KN2IF2G6F4INEJE2MNHA8DAzA7MFI2GbF3N2KN2IF2G5F4IFIE4HMAzDA2DADAcHJIF" +
  "GaOL2NINK2L2IOG4F4I2NE2MHJDA6DADA2DApDAhJIG8OIL2N2I2N4KNLG2F4I3NE2DKA9DArDAjMIOG6IL2OF2IF2I2LN4IGF3I" +
  "FIFJEM2A9DA5DAoDA5DAbDIF2G4OL2F2I5N4MNLIF3IFI3E2HBAcDADAnDA3DAgCO2FG3ILKMN5I4NFI3F2I2NFNCEBLAhDAmDAD" +
  "AhKNIOG3I2OGF2GFGF2I3F3IFI4N2KEAbDA3DADAmDA2DADAhNI3FG2FG3F3I6F4I4N2MFJAaDADADA3DAzAaNI2O3G3F2IMJCN2" +
  "I2F3I2NININIFJAdDA6DApDADAfCN3I2FG3FILNI2F5I2LIN3HF2JAcDADA2DAnDA3DADAfDG3FI2F2G9F4I3N2KJIF2EMAeDA3D" +
  "AnDA2DAgGFG2F2I2FG9F3ILIN3JNIF2JKOA8DA2DA4DAnDA2DAiIFG2F2I2F2G2F3GFOILNICKHENI2F2EHMA9DA2DA2DA4DAkDA" +
  "lLG3F3KIOFI2FOILNHKHCEJKNIF3EMKJAcDA3DAdDA7DA4DAjFG4FIN2LICI2N3GFLJHKNI2F2IEMCKA6DA4DA5DAjDA2DADA7DA" +
  "bDJFG2F3NJH4KHJG3LK2NI3F2IEMHNJAbDADA3DAkDADAkBEJFG2F3HJE3JEFGIGMKN2I2F2INEB2KJAcDAmDADA3DAiK2BENG3F" +
  "3MH5G2ION3I3FI2EB3CNJA9DA2DAD2ADAeDA2DADADADAgDKCBEIFG4F2HN2HLG2I2N2I3FI3EB2HBKBAdDA2DA3DAcDA2DADA3D" +
  "AfDCHJEFLG4F2IN3OG2FINI4FI2JEBHCBCNEJA5DAaDAcDA3DADA2DAgDCKMJ2HI2G4F2IN2G3FINI3FI3EB2C2B2KMC2JA5DA2D" +
  "A4DADA2DA7DADADADA2DAgOEKHMHGF2JFG3F3HNFGF2INI6EB3C2B2CEMCNJ2A4DAiDA3DADADAhM3KHJG3F2KG4F3EFG2FI8EB2" +
  "C2B3HE2B2KNMBA4DADADADA8DA2DADADADADAeJMCJKCBJFG4FIG4F3IFGF2HI5EB3C2B4E2JB2CN2JLA5DADADA9DADADADAfJ2" +
  "KCJEC2J2FG5F2G4F2NF4HI4HEB2C3B4E3MB2HKNCJOA4DADADA2DA2DA2D2ADADAeJ2NKB2JC2MFIHFG9F4NF3HI4JB3C2B5EBE2" +
  "M2BHCKNKJDA5DA2DA6DADADA5DA7J2N2HB3ECBG2LK2G5FG3FIF3IF3JI2EB2C3B5E2B2EBEB3HCKN2JA5DA4DAD2ADADA4DA7J2" +
  "N2CB3CJMCLGOL2BIG4F2G2FI2F2KF3JI2MBHEC2B5E2B6M2H3KN2JBA5DA6DADA4DA5DJ2KNCHB3CHEC2L2DG2FG4FIFGF2IF4IF" +
  "2JIJBCE3C2B4EB7MBMB2C3N2C2ADA3DADADADA3DA5DJMK3CB4C2JECJ2KOG7FIFcHJBCE5C2B3EB2EBaC2K2LNKADAD2A4DA3DA" +
  "5LJN2KCB5C3EHBMJKOG7F2IF4IF4IF2ECE7CB2EBfC2K2LOLA4DA2DA3DA4DMBNKCHB6C2BECMG2IOG4FG3F6I2F6JE9CBEBeC4K" +
  "2LOLA5DA7DJ2NK2HB7C3JBMG4F2G2F3G2F7I2F5EaCBEBcC3B2H2KL2DLADADA7LMNKC2B9C2BEHCFG7F3G3F6I3FIFIEbCEBaHC" +
  "3B2HC2K2NLALADADA4DJKNKCHB2HC2B4C3E2CELFG6F3G3F5I4FIFIE2JEJBME5BaC4B3C3LKLDLA3DADA3LMK2CB3C3B4C3BJBJ" +
  "EJF2G3F2GF3G3F5I7E2JEB2E2JBE2BaC3HMBC3KCLDLOA2DADA3L2MK2C3B8C3BMJ2B3FG3F2G2F2G3F4IFI6EMEB3E2BdC4BMHC" +
  "3HK2L2ALA2DA3OKNKMKC4B7C2HBE2B3MNFG3FG3FG4F3IFI6E2B3E2BcCBC3BMBC5K2ODOA2DADA2L2K2MCKC3B6C3B2JB3CBJF2" +
  "G7FG3F4I7E2B2MEJBcC4B2MC4BCK2L2DA6DL2K2HMKC3B6C3BEB4CB2JF2G5F2G3F5I5E2MB2E2BdC4BM2C3BHK3L2D2A5DGK4EK" +
  "C3B5HC2HBMB4CB2JF3G5F2G2F5I5E2B2JEMBcC5BM2C2B2CK3L3A2DA2D2LK4MHKC2B5HC2B7CB3JF3G5FG3F4I5E2B2E2B9CB3C" +
  "4B2MC2HBC3K2OGODADAD3L2CK2BJKCHB5C2B4HB2C2B3EF5G4FG2F4IFI3JEBJE2MB7HCB2C5BEBC2B2C3KNL2DOA3D2L2KC4EKC" +
  "BMB2HC3B4CB2C2B4JF4G4F2GF5IFI3EME2JB8CB3C4B2M2CB2HC3KL3OADAD3L2KC4JC2MB3C4B3CB2C3B5MF4G4FaI2JE3JB8CB" +
  "2C5BM2C2BHC4KNL2D2A3D2L2K2C3JC2M2B2C3B3HCBHC2B6MJF4G3FbI2E3B8C2BC5B2EBCB2HC3K2LOLOA3D2OL2KCH2CHC2HMB" +
  "C3HB3C2BC3B7J2F2G5F8EJEIE2JB8C2BC2BC2B2EBCJBHC2K2LDL2D3A2DOL2KC2H3MC2B2C3B4CHC3B9EJF3G6F2LEMLOLJ3MB3" +
  "MB4C5BC2BMJC2MBHC2K2LNDLOA3DAOL2K2CHMBEC2B2C2HB3C6B4H2B4EJIF2G5OEJMOBJ2LJNEBM2JB3C5BHCB2EMCHMC4K3L2D" +
  "AGADA2DOK3C2BMBC2B2C2B4C5B5CHB2HBMEJF2G4HJL2J2M3JC2M2BJB4C5BC2B2EBCBMBC4K2GOLOADAD4LK4BM2BCBHCB5C4B5" +
  "HCHB2CHBMEJF2G2OMDMBHM4JKMKEBEB3C5B2C2BMEBCEMB2C2K2NL2GDGADA2OL2K2C2HBEMCHC2B2CB2C3B7C2B2H2B2JEIFG2J" +
  "LJOHBM5JKCM2EB3HC3B3CB2MEC2EMBC4K2L2D2ADADOL4KC3BMEC4BMCBC3B8C2HB6EJIFGJLJCB2M3B2MNMJMJB3HBC2B2C2B2M" +
  "ECBMBC2HCK2L3DADADADL5KHB3EH2CB2MCHC2HB5CB2C3B6E2JKMELMB2M3B2M2LJ2MJB4C2B3C2B2EMCBMBC3K3L3DGADADADOL" +
  "N2K2HB2JH2CB3C4B4HC2BHC4B5E3K2CJLJMBM5JKJIEMB4CB4CB3EBCM3C2K5LDOAGAD2ADOL3K2CB2MBC2BEBHC2B4C3HBC4B5J" +
  "3CHBCELM6EJKJI2JEB4CB3C2B2MEBCJMH2C2K2NLDLAGADAD2G2DL2K2C2BM2CHMEBC2B5C3BC4HB5EJ2LMHC2JLJM2EJKJ2I4EB" +
  "8CB3JEC2M2HC3K2DL3A2DAD3AGLGL2KOCHM2CBM2BC2B4C3B2C4HB6E2NMB2CM2CEJKHJ2I5JEB6HCB3EMCHMBC3KL4D3AD2AD4O" +
  "L3NC3M2CBM2BC2B3C3HBC5HB2HB3JBJNJBHEJK2HEJI4FI3JB6CB3J2BCBMHC2K2LNL2D4A2DADA3LALNKCHBMCBM2BCBHBHC3B2" +
  "C5B2HB3M2HMH2EJI2J3I4F5I2EB4CHB3EMBCB2HC2K2L2OGOD2AD2ADAD2OAL4KCBMH2M2BHB3C3B3C4HB5M3HMEJEI8F7I3JB3H" +
  "B4M2BCBHCK3DLDLOAGA2DADADAODALDLNKC2B2CBMBHB2HC2B4C4B6M3HJKMEJI2F7G2FGF2I2EBaHCBCK4NGLOAGA2DADADAGAD" +
  "LDLDNK3BMCBMBHB2C3B4C4B6M3CBEBEJIF2G2F2G5F3I3EB9CBHCK2NL3DLOADA2DADA4GDO2LDLONHBCHMBHBC3B4C4HB7MBCB5" +
  "HIGFG4FG4F3I2JM3BMB4CHC2KDL3DOALA2DA3DADAD2ALAL2AK2CHC2HBC4B4C4HB7MJHCBH2B2EIF3G2F3G4F3I2EB2MB3HC3K4" +
  "NLDLO2ADA2DA3DAD2AOALAL3K2C5KC3HB3C3HB5HB2MJC2BH2B2MIF2GFG8F3I3B5H2COK2LK2L3D3GAD2ADADADAD3LDLALONDK" +
  "3CDC2KCHCHC3B6CHB2MJC2J2H3MEIF2GFG8F3I3H3CKC3K3L2ALADOA2OA2DA5DADALAOLDLDLDK3HKC4HC3HB4HC2B4JCMOKMBH" +
  "BEI2F2GFG8F3I2MHC2HLK3DLDALALGDGADADA5DADADAOA2LAL2KLK2CKLK2C5H2B3C2HB4JC2KCBH3MI2F3GFG9FI3HNCDKDKL5" +
  "O2DODADADA9DADAOAOLDL2DONL2K4C2DC2HBH2C3HBHBMCH2CJCH2M2IF2G2FG8F2AI3KLKDK2DL3AOADA2DADADAaDA2LA2LAD2" +
  "NDLK4OK2CKC6DCH2B2MCHBJHCH2MBI2F3GFG8F2DIGIKLKALD2LD2GOA2DADA7DA2DADADADALDLALDLAKLKNK4DKCKC2K2C4B2C" +
  "3HC2BCMH2IF4GAG7F2AFOAODL2AL2ALOA2ODADADADA6DA3DADAGAOALDL2ALGDLGLN2KbC7KC2H3CFIFAF3G2DGAG2DF2AF2ALA" +
  "GLDODAD2ADA3DAaDA5GADADAODALALAL2NLNKDLK2LKGLC2KCHK3CHC3HC2NIF3ADFG7AGFAG3LA2OAOGA2DA2DAbDA2D2A3DA2D" +
  "A2OA2LALALALAL4NL2K6HK4CDC2LDC2DFAFDGAGDGDG2AGAG2DGAGDAGDAGA4DA2DAgDADADOA2OADOALALAOLDL2DL2GL3OKGNK" +
  "6DK3DF2D2FAGAFAGD2GAGAGDAOAGDAD2ADA2DAlDADA5GAD2ALAL2ALALO2LOG2L2OKNKDNK2DK3AKLAFD3AGAGDG2AGAGD3ADA2" +
  "DAD2A6DAfDADADADAD2A2DADAGAOAOAOAOAL2DLGL5AL2AKDKALDLGAGAGDAGAGA2GAGDADAD2ADADADADADAqDADA2DADAGAGAO" +
  "AODOD2LDL2DLDL2AL3ALALA2LGAGAGA2GAG2AGA2DADA2DA3DAjDA2DA2DADA2DA3DA2DADADADADAGAD3OD2OAOA2LALALALALO" +
  "A2GAGAG2ADA2DADA2D2ADADA2DA2DApDADA7DADADADADADAD2AD2ADA2GDA2DAOGAOAODADADAD2AD2ADADADA5D2A2DAoDA4DA" +
  "DADA5DA3DADADA2D5ADA2D2ADA2DA2DA4DA2DADADADA6DA2DAzA5DA2DA3DA3DAD3ADA2DA3DA2DADA3DADADA4DA3DA3DAzAoD" +
  "ADADA2DADA2DAzA9";

/** RLE string -> Uint8Array of palette indices, one per cell. */
export function decodePortrait(rle: string = PORTRAIT_PIXELS): Uint8Array {
  const cells = new Uint8Array(PORTRAIT_WIDTH * PORTRAIT_HEIGHT);
  let read = 0;
  let write = 0;

  while (read < rle.length) {
    const index = rle.charCodeAt(read++) - 65; // "A" -> 0
    const start = read;
    while (read < rle.length) {
      const code = rle.charCodeAt(read);
      if (code >= 65 && code <= 79) break; // next palette marker
      read++;
    }
    const run = read > start ? parseInt(rle.slice(start, read), 36) : 1;
    cells.fill(index, write, write + run);
    write += run;
  }

  return cells;
}

/**
 * Flood-fills the background colour inward from the border and marks it
 * transparent, so enclosed highlights of the same colour (catchlights in the
 * eyes, the shirt buttons) survive.
 */
function backgroundMask(cells: Uint8Array, bgIndex = 0): Uint8Array {
  const w = PORTRAIT_WIDTH;
  const h = PORTRAIT_HEIGHT;
  const mask = new Uint8Array(w * h);
  const stack: number[] = [];

  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);

  while (stack.length) {
    const p = stack.pop()!;
    if (mask[p] || cells[p] !== bgIndex) continue;
    mask[p] = 1;
    const x = p % w;
    if (x > 0) stack.push(p - 1);
    if (x < w - 1) stack.push(p + 1);
    if (p >= w) stack.push(p - w);
    if (p < w * (h - 1)) stack.push(p + w);
  }

  return mask;
}

const SCALE = 8; // backing-store multiplier; CSS handles final display size

/**
 * Rec. 709 luma, with a light contrast stretch around mid-grey. Straight
 * luminance leaves the black shirt and the dark hair almost indistinguishable;
 * the stretch keeps the silhouette readable while the portrait is at rest.
 */
export function toGreyscale(palette: string[] = PORTRAIT_PALETTE, contrast = 1.12): string[] {
  return palette.map((hex) => {
    const n = parseInt(hex.replace("#", ""), 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const v = Math.round(Math.min(255, Math.max(0, (luma - 128) * contrast + 128)));
    const hx = v.toString(16).padStart(2, "0");
    return `#${hx}${hx}${hx}`;
  });
}

type LayerOpts = {
  palette: string[];
  pixels: string;
  transparent: boolean;
  background?: string;
};

/** Paints one palette onto one canvas. Shared by both layers. */
function usePortraitLayer(
  ref: React.RefObject<HTMLCanvasElement | null>,
  { palette, pixels, transparent, background }: LayerOpts,
) {
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const w = PORTRAIT_WIDTH;
    const h = PORTRAIT_HEIGHT;
    const cells = decodePortrait(pixels);
    const mask = transparent ? backgroundMask(cells) : null;

    const rgb = palette.map((hex) => {
      const n = parseInt(hex.replace("#", ""), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    });

    const buffer = new ImageData(w, h);
    for (let i = 0; i < cells.length; i++) {
      const [r, g, b] = rgb[cells[i]] ?? [0, 0, 0];
      const o = i * 4;
      buffer.data[o] = r;
      buffer.data[o + 1] = g;
      buffer.data[o + 2] = b;
      buffer.data[o + 3] = mask && mask[i] ? 0 : 255;
    }

    const source = document.createElement("canvas");
    source.width = w;
    source.height = h;
    source.getContext("2d")!.putImageData(buffer, 0, 0);

    canvas.width = w * SCALE;
    canvas.height = h * SCALE;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (background) {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  }, [ref, palette, pixels, transparent, background]);
}

const layerStyle: CSSProperties = {
  display: "block",
  width: "100%",
  height: "auto",
  aspectRatio: `${PORTRAIT_WIDTH} / ${PORTRAIT_HEIGHT}`,
  imageRendering: "pixelated",
};

type Props = {
  palette?: string[];
  greyPalette?: string[];
  pixels?: string;
  transparent?: boolean;
  background?: string;
  /** "auto" follows hover/focus. "colour" and "grey" pin the state. */
  mode?: "auto" | "colour" | "grey";
  /** Cross-fade length in frames of --f. Stepped, never eased (constraint #4). */
  frames?: number;
  focusable?: boolean;
  className?: string;
  style?: CSSProperties;
  alt?: string;
};

export default function PixelPortrait({
  palette = PORTRAIT_PALETTE,
  greyPalette,
  pixels = PORTRAIT_PIXELS,
  transparent = false,
  background,
  mode = "auto",
  frames = 4,
  focusable = false,
  className = "",
  style,
  alt = "Pixel-art portrait of Shareef Padar, hand resting against his chin",
}: Props) {
  const colourRef = useRef<HTMLCanvasElement>(null);
  const greyRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [canHover, setCanHover] = useState(true);

  const greys = useMemo(() => greyPalette ?? toGreyscale(palette), [greyPalette, palette]);

  usePortraitLayer(greyRef, { palette: greys, pixels, transparent, background });
  usePortraitLayer(colourRef, { palette, pixels, transparent, background });

  // A pointer that cannot hover never fires mouseenter, so the portrait would
  // be stuck in grey on touch. Show it in colour there instead.
  useEffect(() => {
    const hover = window.matchMedia("(hover: hover)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setCanHover(hover.matches);
      setReduceMotion(motion.matches);
    };
    sync();
    hover.addEventListener("change", sync);
    motion.addEventListener("change", sync);
    return () => {
      hover.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);

  const showColour = mode === "colour" || (mode === "auto" && (active || !canHover));

  return (
    <span
      className={className}
      style={{ position: "relative", display: "block", ...style }}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      tabIndex={focusable ? 0 : undefined}
      role="img"
      aria-label={alt}
    >
      <canvas ref={greyRef} aria-hidden="true" style={layerStyle} />
      <canvas
        ref={colourRef}
        aria-hidden="true"
        style={{
          ...layerStyle,
          position: "absolute",
          inset: 0,
          opacity: showColour ? 1 : 0,
          // steps(), not a curve: the colour dissolves in over `frames`
          // discrete levels. Nothing in this system interpolates.
          transition: reduceMotion
            ? "none"
            : `opacity calc(var(--f) * ${frames}) steps(${frames}, end)`,
        }}
      />
    </span>
  );
}
