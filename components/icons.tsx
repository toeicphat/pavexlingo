import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5zM2 12l10 5 10-5-10-5-10 5z" opacity="0.6"/>
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"/>
    </svg>
);

export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

export const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
    </svg>
);

export const TargetFillIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
        </defs>
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g fillRule="nonzero">
                <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" fill="none" />
                <path d="M12,2 C12.8958,2 13.764,2.11778 14.5901,2.33869 L12.4643,4.46447 C12.3013,4.62754 12.1589,4.80745 12.039,5.00011 L12,5 C8.13401,5 5,8.13401 5,12 C5,15.866 8.13401,19 12,19 C15.866,19 19,15.866 19,12 L18.9999,11.9608 C19.1925,11.8409 19.3724,11.6986 19.5354,11.5355 L21.6613,9.40969 C21.8822,10.2358 22,11.1042 22,12 C22,17.5228 17.5228,22 12,22 C6.47715,22 2,17.5228 2,12 C2,6.47715 6.47715,2 12,2 Z M11.5857,7.01692 C11.5857,7.86845 11.5436,8.7307 11.5902,9.58107 L11.0501,10.1212 C10.269,10.9023 10.269,12.1686 11.0501,12.9497 C11.8331,13.7307 13.0974,13.7307 13.8785,12.9497 L14.4185,12.4096 C15.269,12.4564 16.1314,12.4142 16.9831,12.4142 C16.7725,14.9819 14.6219,17 12,17 C9.23858,17 7,14.7614 7,12 C7,9.3781 9.01808,7.22755 11.5857,7.01692 Z M18.5039,2.1262 C18.8776,2.28098 19.1212,2.64562 19.1212,3.05008 L19.1212,4.8785 L20.9496,4.8785 C21.3541,4.8785 21.7187,5.12215 21.8735,5.49582 C22.0283,5.8695 21.9427,6.29961 21.6567,6.58561 L18.1212,10.1211 C17.9337,10.3087 17.6793,10.414 17.4141,10.414 L14.9999,10.414 L13.1715,12.2425 C12.7809,12.633 12.1478,12.633 11.7572,12.2425 C11.3667,11.8519 11.3667,11.2188 11.7572,10.8282 L13.5857,8.99983 L13.5857,6.58561 C13.5857,6.32039 13.691,6.06604 13.8786,5.8785 L17.4141,2.34297 C17.7001,2.05697 18.1302,1.97142 18.5039,2.1262 Z" fill="url(#blueGradient)" />
            </g>
        </g>
    </svg>
);

export const MoneyEmojiIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" {...props}>
        <radialGradient id="moneyEmojiGrad" cx="63.6" cy="-2088.9" r="56.96" gradientTransform="matrix(1 0 0 -1 0 -2026)" gradientUnits="userSpaceOnUse">
            <stop offset=".5" stopColor="#fde030" />
            <stop offset=".919" stopColor="#f7c02b" />
            <stop offset="1" stopColor="#f4a223" />
        </radialGradient>
        <path d="M63.6 118.8c-27.9 0-58-17.5-58-55.9S35.7 7 63.6 7c15.5 0 29.8 5.1 40.4 14.4c11.5 10.2 17.6 24.6 17.6 41.5s-6.1 31.2-17.6 41.4c-10.6 9.3-25 14.5-40.4 14.5z" fill="url(#moneyEmojiGrad)" />
        <path d="M111.49 29.67c5.33 8.6 8.11 18.84 8.11 30.23c0 16.9-6.1 31.2-17.6 41.4c-10.6 9.3-25 14.5-40.4 14.5c-18.06 0-37.04-7.35-48.18-22.94c10.76 17.66 30.99 25.94 50.18 25.94c15.4 0 29.8-5.2 40.4-14.5c11.5-10.2 17.6-24.5 17.6-41.4c0-12.74-3.47-24.06-10.11-33.23z" fill="#eb8f00" />
        <path d="M62.67 80.42c-12.72 0-24.54-1.07-34.41-2.89c-2.45-.45-4.61 1.7-4.11 4.14c3.28 16.04 19.07 29.21 38.51 29.21c21.27 0 35.59-13.6 38.56-29.27c.46-2.42-1.7-4.53-4.12-4.08c-9.88 1.82-21.71 2.89-34.43 2.89z" fill="#422b0d" />
        <path d="M89.58 57.31c-.3-.74-.75-1.4-1.32-1.96c-.58-.57-1.28-1.06-2.11-1.48c-.66-.33-1.4-.64-2.2-.92v-8.41c.15.05.31.09.45.16c.51.25.94.61 1.29 1.06c.35.45.62.99.8 1.61c.07.25.13.5.17.76c.12.73.72 1.29 1.46 1.29h.04c.96 0 1.67-.85 1.53-1.79c-.21-1.44-.69-2.63-1.43-3.57c-1.02-1.3-2.46-2.08-4.31-2.34v-2.21c0-.8-.65-1.45-1.45-1.45h0c-.8 0-1.45.65-1.45 1.45v2.28c-.74.12-1.43.31-2.05.6c-.74.34-1.36.79-1.88 1.35c-.51.56-.91 1.22-1.2 1.97c-.28.75-.42 1.59-.42 2.53c0 .99.16 1.86.48 2.61c.32.75.78 1.42 1.37 2c.59.58 1.3 1.08 2.14 1.5c.48.24 1.01.47 1.56.68v8.67l-.01.01a4 4 0 0 1-1.91-.88c-.44-.37-.79-.86-1.07-1.47c-.14-.31-.24-.65-.31-1.04c-.13-.72-.71-1.28-1.45-1.28h-.15c-.91 0-1.6.82-1.45 1.71c.09.55.23 1.05.42 1.51c.37.9.85 1.64 1.46 2.23c.61.59 1.31 1.04 2.1 1.35c.75.3 1.54.48 2.36.58v1.74c0 .8.65 1.45 1.45 1.45h0c.8 0 1.45-.65 1.45-1.45v-1.79c.84-.11 1.62-.3 2.32-.59c.79-.33 1.46-.77 2.02-1.32c.55-.55.98-1.2 1.29-1.97c.3-.76.46-1.63.46-2.59c.01-.98-.14-1.85-.45-2.59zm-9.9-6.46c-.38-.35-.66-.75-.84-1.18c-.18-.43-.27-.92-.27-1.48c.01-1.19.36-2.13 1.05-2.83c.37-.38.86-.65 1.43-.82v7.23c-.55-.28-1.01-.59-1.37-.92zm6.95 10.72c-.22.48-.52.89-.92 1.23c-.4.34-.89.6-1.46.77c-.09.03-.19.04-.29.06v-7.51c.79.37 1.43.77 1.89 1.21c.75.72 1.12 1.58 1.1 2.59c0 .63-.11 1.17-.32 1.65z" fill="#422b0d" stroke="#422b0d" strokeWidth=".5" strokeMiterlimit="10" />
        <path d="M44.54 87.78v21.15c0 9.51 7.71 17.21 17.21 17.21h3.28c9.51 0 17.21-7.71 17.21-17.21v-21.3c-19.01 3.72-33.17 1.2-37.7.15z" fill="#05e005" />
        <path d="M62.66 85.03c-6.19 0-12.28-.25-18.12-.74v3.49c4.54 1.05 18.69 3.57 37.71-.15v-3.48c-6.29.57-12.88.88-19.59.88z" fill="#05e005" />
        <path d="M62.66 85.03c-6.19 0-12.28-.25-18.12-.74v3.49c4.54 1.05 18.69 3.57 37.71-.15v-3.48c-6.29.57-12.88.88-19.59.88z" opacity=".3" fill="#ab3f2e" />
        <path d="M70.97 108.27c-.3-.74-.75-1.4-1.32-1.96c-.58-.57-1.28-1.06-2.11-1.48c-.66-.33-1.4-.64-2.2-.92V95.5c.15.05.31.09.45.16c.51.25.94.61 1.29 1.06c.35.45.62.99.8 1.61c.07.25.13.5.17.76c.12.73.72 1.29 1.46 1.29h.04c.96 0 1.67-.85 1.53-1.79c-.21-1.43-.69-2.62-1.43-3.57c-1.02-1.3-2.46-2.08-4.31-2.34v-2.21a1.451 1.451 0 0 0-2.9 0v2.28c-.74.12-1.43.31-2.05.6c-.74.34-1.36.79-1.88 1.35c-.51.56-.91 1.22-1.2 1.97c-.28.75-.42 1.59-.42 2.53c0 .99.16 1.86.48 2.61c.32.75.78 1.42 1.37 2c.59.58 1.3 1.08 2.14 1.5c.48.24 1.01.47 1.56.68v8.67l-.01.01a4 4 0 0 1-1.91-.88c-.44-.37-.79-.86-1.07-1.47c-.14-.31-.24-.65-.31-1.04c-.14-.72-.72-1.28-1.46-1.28h-.15c-.91 0-1.6.82-1.45 1.71c.09.55.23 1.05.42 1.51c.37.9.85 1.64 1.46 2.23c.61.59 1.31 1.04 2.1 1.35c.75.3 1.54.48 2.36.58v1.74a1.451 1.451 0 0 0 2.9 0v-1.79c.84-.11 1.62-.3 2.32-.59c.79-.33 1.46-.77 2.02-1.32c.55-.55.98-1.2 1.29-1.97c.3-.76.46-1.63.46-2.59c.01-.98-.14-1.84-.44-2.59zm-9.91-6.46c-.38-.35-.66-.75-.84-1.18c-.18-.43-.27-.92-.27-1.48c.01-1.19.36-2.13 1.05-2.83c.37-.38.86-.65 1.43-.82v7.23c-.55-.28-1.01-.59-1.37-.92zm6.95 10.73c-.22.48-.52.89-.92 1.23c-.4.34-.89.6-1.46.77c-.09.03-.19.04-.29.06v-7.51c.79.37 1.43.77 1.89 1.21c.75.72 1.12 1.58 1.1 2.59c0 .62-.11 1.16-.32 1.65z" fill="#404040" />
        <path d="M29.75 32.79c-1.67 1.43-4.15-.63-2.59-2.59c1.16-1.42 2.72-2.77 4.42-3.79c4.58-2.95 10.22-3.9 15.03-2.95c2.45.53 1.7 3.65-.54 3.66c-5.67-.08-11.58 1.83-16.32 5.67" fill="#422b0d" />
        <path d="M97.52 32.79c1.67 1.43 4.15-.63 2.59-2.59c-1.16-1.42-2.72-2.77-4.42-3.79c-4.58-2.95-10.22-3.9-15.03-2.95c-2.45.53-1.7 3.65.54 3.66c5.67-.08 11.59 1.83 16.32 5.67" fill="#422b0d" />
        <path d="M50.69 57.31c-.3-.74-.75-1.4-1.32-1.96c-.58-.57-1.28-1.06-2.11-1.48c-.66-.33-1.4-.64-2.2-.92v-8.41c.15.05.31.09.45.16c.51.25.94.61 1.29 1.06c.35.45.62.99.8 1.61c.07.25.13.5.17.76c.12.73.72 1.29 1.46 1.29h.04c.96 0 1.67-.85 1.53-1.79c-.21-1.43-.69-2.62-1.43-3.57c-1.02-1.3-2.46-2.08-4.31-2.34v-2.21c0-.8-.65-1.45-1.45-1.45h0c-.8 0-1.45.65-1.45 1.45v2.28c-.74.12-1.43.31-2.05.6c-.74.34-1.36.79-1.88 1.35c-.51.56-.91 1.22-1.2 1.97c-.28.75-.42 1.59-.42 2.53c0 .99.16 1.86.48 2.61c.32.75.78 1.42 1.37 2c.59.58 1.3 1.08 2.14 1.5c.48.24 1.01.47 1.56.68v8.67l-.01.01a4 4 0 0 1-1.91-.88c-.44-.37-.79-.86-1.07-1.47c-.14-.31-.24-.65-.31-1.04c-.13-.72-.71-1.28-1.45-1.28h-.15c-.91 0-1.6.82-1.45 1.71c.09.55.23 1.05.42 1.51c.37.9.85 1.64 1.46 2.23c.61.59 1.31 1.04 2.1 1.35c.75.3 1.54.48 2.36.58v1.74c0 .8.65 1.45 1.45 1.45h0c.8 0 1.45-.65 1.45-1.45v-1.79c.84-.11 1.62-.3 2.32-.59c.79-.33 1.46-.77 2.02-1.32c.55-.55.98-1.2 1.29-1.97c.3-.76.46-1.63.46-2.59c.01-.98-.14-1.85-.45-2.59zm-9.9-6.46c-.38-.35-.66-.75-.84-1.18c-.18-.43-.27-.92-.27-1.48c.01-1.19.36-2.13 1.05-2.83c.37-.38.86-.65 1.43-.82v7.23c-.55-.28-1.01-.59-1.37-.92zm6.95 10.72c-.22.48-.52.89-.92 1.23c-.4.34-.89.6-1.46.77c-.09.03-.19.04-.29.06v-7.51c.79.37 1.43.77 1.89 1.21c.75.72 1.12 1.58 1.1 2.59c0 .63-.11 1.17-.32 1.65z" fill="#422b0d" stroke="#422b0d" strokeWidth=".5" strokeMiterlimit="10" />
    </svg>
);

export const LoadingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 24 24" {...props}>
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const PauseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

export const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.084-1.28-.24-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.084-1.28.24-1.857m0 0A5.002 5.002 0 0112 13a5 5 0 015.757 4.143" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const BookOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

export const BrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.871 15.129C4.345 13.824 4 12.436 4 11c0-4.418 3.582-8 8-8s8 3.582 8 8c0 1.436-.345 2.824-.871 4.129m-14.258 0A8.003 8.003 0 0012 21a8.003 8.003 0 007.129-5.871m-14.258 0V15.5a2.5 2.5 0 105 0V15.13m-5 0h5m9.258 0a2.5 2.5 0 115 0V15.13m-5 0h5M9 11a1 1 0 11-2 0 1 1 0 012 0zm6 0a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
);

export const PuzzleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5A1.5 1.5 0 0011.5 2h-1A1.5 1.5 0 009 3.5V5H5c-1.1 0-2 .9-2 2v4H1.5A1.5 1.5 0 000 12.5v1A1.5 1.5 0 001.5 15H3v4c0 1.1.9 2 2 2h4v1.5a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5V21h4c1.1 0 2-.9 2-2v-4h1.5a1.5 1.5 0 001.5-1.5v-1A1.5 1.5 0 0020.5 11z" />
    </svg>
);

export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const LightBulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

export const TypeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <polyline points="4 7 4 4 20 4 20 7"></polyline>
        <line x1="9" y1="20" x2="15" y2="20"></line>
        <line x1="12" y1="4" x2="12" y2="20"></line>
    </svg>
);

export const FlipIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 12h22" />
    </svg>
);

export const ShuffleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
    </svg>
);

export const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

export const ArrowRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);

export const GridIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

export const HeadphoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v3a3 3 0 01-3 3z" />
    </svg>
);

export const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 18a6 6 0 100-12 6 6 0 000 12z" />
    </svg>
);

export const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

export const DesktopIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

export const LinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.596a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

export const TargetIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);

export const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

export const RefreshIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-4.991-2.691L7.985 5.644m0 0l-3.182 3.182m3.182-3.182v4.995" />
  </svg>
);

export const StopIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M6 6h12v12H6z" />
    </svg>
);

export const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 011.036-7.382L9 5.25m6.75 13.5l2.464-6.368a9.75 9.75 0 001.036-7.382V3M12 21v-3.375m0 0V12m0 5.625a2.25 2.25 0 002.25-2.25H9.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a2.25 2.25 0 01-1.473-1.473L12 18.75l1.938-.648a2.25 2.25 0 011.473-1.473L17.25 15l.648 1.938a2.25 2.25 0 011.473 1.473L21.25 18.75l-1.938.648a2.25 2.25 0 01-1.473 1.473z" />
    </svg>
);

export const MicrophoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v3a3 3 0 01-3 3z" />
    </svg>
);

export const CameraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </svg>
);

export const QuestionMarkCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const SectionDictationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" {...props}>
        <path d="M216 260c0 15.464-12.536 28-28 28s-28-12.536-28-28c0-44.112 35.888-80 80-80s80 35.888 80 80c0 15.464-12.536 28-28 28s-28-12.536-28-28c0-13.234-10.767-24-24-24s-24 10.766-24 24zm24-176c-97.047 0-176 78.953-176 176c0 15.464 12.536 28 28 28s28-12.536 28-28c0-66.168 53.832-120 120-120s120 53.832 120 120c0 75.164-71.009 70.311-71.997 143.622L288 404c0 28.673-23.327 52-52 52c-15.464 0-28 12.536-28 28s12.536 28 28 28c59.475 0 107.876-48.328 108-107.774c.595-34.428 72-48.24 72-144.226c0-97.047-78.953-176-176-176zm-80 236c-17.673 0-32 14.327-32 32s14.327 32 32 32s32-14.327 32-32s-14.327-32-32-32zM32 448c-17.673 0-32 14.327-32 32s14.327 32 32 32s32-14.327 32-32s-14.327-32-32-32zm480-187.993c0-1.518-.012-3.025-.045-4.531C510.076 140.525 436.157 38.47 327.994 1.511c-14.633-4.998-30.549 2.809-35.55 17.442c-5 14.633 2.81 30.549 17.442 35.55c85.906 29.354 144.61 110.513 146.077 201.953l.003.188c.026 1.118.033 2.236.033 3.363c0 15.464 12.536 28 28 28s28.001-12.536 28.001-28zM152.971 439.029l-80-80L39.03 392.97l80 80l33.941-33.941z"/>
    </svg>
);

export const SectionVocabIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}>
            <path d="M27.282 38.588V31.2h1.662a3.23 3.23 0 0 1 3.232 3.231v.924a3.23 3.23 0 0 1-3.232 3.231zm7.185-14.403v-7.387h2.418c1.367 0 2.475 1.11 2.475 2.48s-1.108 2.481-2.475 2.481h-2.418m2.418 0l2.418 2.424M21.862 8.026a2.447 2.447 0 0 1 2.447 2.447v2.493a2.447 2.447 0 0 1-2.447 2.447h0a2.447 2.447 0 0 1-2.447-2.447v-2.493a2.447 2.447 0 0 1 2.447-2.447M16.183 21.23l-1.846 7.387l-1.847-7.387l-1.847 7.387l-1.847-7.387"/>
            <circle cx="22.001" cy="11.997" r="6.002"/>
            <circle cx="36.498" cy="20.491" r="6.002"/>
            <circle cx="12.887" cy="24.81" r="7.387"/>
            <circle cx="29.203" cy="34.618" r="7.387"/>
            <path d="m33.841 25.873l-1.177 2.22m-1.17-10.916l-4.225-2.305m-9.176 1.68l-1.53 1.85"/>
        </g>
    </svg>
);

export const SectionGrammarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M6 22q-1.25 0-2.125-.875T3 19V5q0-1.25.875-2.125T6 2h9q.825 0 1.413.588T17 4v12q0 .825-.587 1.413T15 18H6q-.425 0-.712.288T5 19t.288.713T6 20h13V5q0-.425.288-.712T20 4t.713.288T21 5v15q0 .825-.587 1.413T19 22zm1.55-8.5q.2 0 .338-.1t.187-.275L8.6 11.7h2.825l.5 1.425q.05.175.2.275t.325.1q.3 0 .475-.25t.05-.525l-2.2-5.85q-.05-.175-.2-.275t-.35-.1h-.45q-.2 0-.35.1t-.2.275l-2.2 5.875q-.1.275.063.513t.462.237m1.4-2.8l1.025-2.9h.05l1.025 2.9z"/>
    </svg>
);

export const TestQuizIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg fill="currentColor" version="1.1" viewBox="0 0 403.48 403.48" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g>
            <path d="M277.271,0H46.176v403.48h311.129V80.035L277.271,0z M281.664,25.607l50.033,50.034h-50.033V25.607z M61.176,388.48V15 h205.489v75.641h75.641v297.84H61.176z"/>
            <path d="M101.439,117.58h55.18V62.4h-55.18V117.58z M116.439,77.4h25.18v25.18h-25.18V77.4z"/>
            <path d="M101.439,192.08h55.18V136.9h-55.18V192.08z M116.439,151.9h25.18v25.18h-25.18V151.9z"/>
            <path d="M101.439,266.581h55.18V211.4h-55.18V266.581z M116.439,226.4h25.18v25.181h-25.18V226.4z"/>
            <path d="M101.439,341.081h55.18v-55.18h-55.18V341.081z M116.439,300.901h25.18v25.18h-25.18V300.901z"/>
            <rect x="177.835" y="326.081" width="114.688" height="15"/>
            <rect x="177.835" y="251.581" width="114.688" height="15"/>
            <rect x="177.835" y="177.08" width="114.688" height="15"/>
            <rect x="177.835" y="102.58" width="114.688" height="15"/>
        </g>
    </svg>
);

export const AudioChoiceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M19 6C20.5 7.5 21 10 21 12C21 14 20.5 16.5 19 18M16 8.99998C16.5 9.49998 17 10.5 17 12C17 13.5 16.5 14.5 16 15M3 10.5V13.5C3 14.6046 3.5 15.5 5.5 16C7.5 16.5 9 21 12 21C14 21 14 3 12 3C9 3 7.5 7.5 5.5 8C3.5 8.5 3 9.39543 3 10.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const DictationModeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg fill="currentColor" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M39.6,108.1c-8.8,0-16-7.2-16-16c0-2.2,1.8-4,4-4s4,1.8,4,4c0,4.4,3.6,8,8,8c2.8,0,5.4-1.5,6.9-3.9
            c0.6-1,1.4-2.8,2.3-4.7c1.7-3.8,3.6-8.1,6-11.2c1.9-2.5,4.7-5,7.4-7.5c2.7-2.5,5.8-5.4,6.8-7.2c2-3.5,3-7.4,3-11.4
            c0-12.7-10.3-23-23-23s-23,10.3-23,23c0,2.2-1.8,4-4,4s-4-1.8-4-4c0-17.1,13.9-31,31-31c17.1,0,31,13.9,31,31
            c0,5.4-1.4,10.7-4.1,15.4c-1.6,2.9-4.9,5.9-8.4,9.1c-2.4,2.3-5,4.6-6.5,6.5c-1.8,2.3-3.6,6.3-5,9.5c-1,2.2-1.8,4.1-2.7,5.6
            C50.5,105.1,45.2,108.1,39.6,108.1z"/>
        <path d="M34,79.6c-2.2,0-4-1.8-4-4s1.8-4,4-4c2,0,3.7-1.6,3.7-3.7c0-2-1.6-3.7-3.7-3.7c-2.2,0-4-1.8-4-4v-6
            c0-10.5,8.5-19,19-19s19,8.5,19,19c0,3.3-0.8,6.5-2.4,9.3c-0.1,0.1-0.1,0.2-0.2,0.3c-0.8,1.2-2.7,3-5.9,6l-1.2,1.1
            c-1.6,1.5-4.2,1.4-5.7-0.2c-1.5-1.6-1.4-4.2,0.2-5.7L54,64c2.6-2.4,4.2-3.9,4.7-4.6c0.8-1.6,1.3-3.4,1.3-5.2c0-6.1-4.9-11-11-11
            s-11,4.9-11,11v2.7c4.5,1.6,7.7,5.9,7.7,11C45.7,74.3,40.5,79.6,34,79.6z"/>
        <path d="M85,78.7c-0.6,0-1.2-0.2-1.7-0.5c-1.7-1-2.2-3.1-1.3-4.8c3.3-5.8,5.1-12.3,5.1-19c0-6.8-1.8-13.4-5.2-19.2
            c-1-1.7-0.4-3.8,1.2-4.8c1.7-1,3.8-0.4,4.8,1.2c4.1,6.9,6.2,14.8,6.2,22.8c0,7.9-2.1,15.6-6,22.5C87.4,78.1,86.2,78.7,85,78.7z"/>
        <path d="M95.9,90.1c-0.8,0-1.5-0.2-2.2-0.7c-1.8-1.2-2.3-3.7-1.1-5.6c5.9-8.7,9-18.8,9-29.4
            c0-10.6-3.2-20.9-9.2-29.6c-1.2-1.8-0.8-4.3,1-5.6c1.8-1.2,4.3-0.8,5.6,1c6.9,10.1,10.6,21.9,10.6,34.1c0,12.1-3.6,23.8-10.3,33.8
            C98.4,89.5,97.1,90.1,95.9,90.1z"/>
    </svg>
);

export const FlashcardsModeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fill="currentColor" d="M386.688 487.75l-119.236-55.423c-7.898-3.673-11.334-13.065-7.66-20.976l84.374-181.523c3.667-7.904 13.07-11.334 20.963-7.667l119.24 55.434c7.9 3.673 11.33 13.065 7.656 20.964l-84.37 181.524c-3.678 7.904-13.076 11.334-20.968 7.667zM98.95 467.945L19.79 284.09c-3.448-8.007.255-17.302 8.25-20.744l39.196-16.872 48.975 184.044c4.694 17.588 22.755 28.078 40.36 23.39l39.032-10.386-75.907 32.686c-8.007 3.443-17.296-.255-20.744-8.262zm33.89-41.86L81.362 232.638c-2.24-8.42 2.78-17.078 11.19-19.312l34.033-9.052-4.098 30.465c-2.422 18.036 10.224 34.652 28.285 37.087l79.828 10.758-32.497 109.467c-3.345 11.28-.37 22.948 6.866 31.18l-52.82 14.05c-8.42 2.24-17.07-2.77-19.31-11.196zm108.428-4.76l-16.02-4.76c-8.36-2.49-13.12-11.267-10.644-19.627l56.97-191.9c2.484-8.36 11.28-13.12 19.622-10.65l49.073 14.583.008-.005.12.044-.133-.034c-4.93 3.254-9.04 7.868-11.705 13.605l-84.38 181.53c-2.587 5.586-3.486 11.517-2.915 17.218zm-5.707-155.43l-82.486-11.117c-8.633-1.166-14.704-9.12-13.538-17.758l26.73-198.39c1.16-8.633 9.125-14.698 17.74-13.538l130.327 17.563c8.627 1.166 14.692 9.125 13.532 17.752L311.42 182.46l-15.33-4.552c-17.467-5.197-35.826 4.784-41.004 22.232l-19.525 65.755zm-5.19-31.46c4.67-3.055 7.474-7.438 8.42-13.145.936-5.633-.357-10.617-3.866-14.945-3.51-4.414-8.39-7.14-14.656-8.178-6.344-1.057-11.93-.073-16.75 2.956-4.826 3.03-7.692 7.316-8.615 12.87-.898 5.386.425 10.42 3.97 15.082 3.565 4.504 8.525 7.285 14.863 8.34 6.35 1.057 11.893.062 16.634-2.98zm25.978-81.243c4.693-2.726 8.888-5.434 12.598-8.117 3.703-2.684 6.915-5.586 9.635-8.725 2.72-3.13 4.967-6.573 6.733-10.307 1.76-3.74 3.048-8.032 3.85-12.865 1.262-7.62 1.02-14.358-.735-20.234-1.75-5.87-4.693-10.94-8.833-15.22-4.135-4.27-9.24-7.753-15.318-10.43-6.07-2.684-12.804-4.633-20.174-5.86-7.692-1.28-15.3-1.602-22.815-.977-7.516.614-14.63 2.247-21.346 4.88l-5.95 35.802c6.813-4.25 13.77-7.104 20.855-8.567 7.09-1.475 13.726-1.7 19.913-.668 21.467 4.092 19.44 24.898 8.76 34.03-5.652 4.473-11.334 8.802-15.942 11.345-10.48 5.914-27.69 23.125-22.542 45.145l31.284 5.202c-7.11-17.757 11.663-29.462 20.028-34.434z"/>
    </svg>
);
