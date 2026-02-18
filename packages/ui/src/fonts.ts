// If you prefer to use Google Fonts directly:
import { Inter, Outfit, Urbanist as GoogleUrbanist, IBM_Plex_Sans, Sofia as GoogleSofia } from 'next/font/google';

export const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

export const outfit = Outfit({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-outfit',
});

export const urbanist = GoogleUrbanist({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-urbanist',
});

export const ibmPlexSans = IBM_Plex_Sans({
    weight: ['100', '200', '300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-ibm-plex',
});

export const sofia = GoogleSofia({
    weight: ['400'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-sofia',
});

// Using local font file:
// import localFont from 'next/font/local';

/*
export const haasGrotDisp = localFont({
    src: './assets/fonts/HaasGrotDisp-Trial.woff2',
    display: 'swap',
    variable: '--font-haas-disp',
});

export const haasGrotText = localFont({
    src: './assets/fonts/HaasGrotText-Trial.woff2',
    display: 'swap',
    variable: '--font-haas-text',
});
*/

// Mocking local fonts with inter/ibm for now until files are available
export const haasGrotDisp = { variable: '--font-haas-disp' };
export const haasGrotText = { variable: '--font-haas-text' };

export const fonts = {
    inter,
    outfit,
    urbanist,
    ibmPlexSans,
    sofia,
    haasGrotDisp,
    haasGrotText,
    variableClass: `${inter.variable} ${outfit.variable} ${urbanist.variable} ${ibmPlexSans.variable} ${sofia.variable}`,
};
