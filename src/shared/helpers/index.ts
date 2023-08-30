import axios from 'axios';

import { PINATA_API_KEY, PINATA_SECRET_API_KEY } from '@/shared/constants';

export const handlePinImage = async (img: string, name: string) => {
    const data = new FormData();

    const imgResponse = await fetch(img);
    const blob = await imgResponse.blob();

    data.append('file', new File([blob], 'File name', { type: 'image/png' }));

    const metadata = JSON.stringify({
        name,
    });

    data.append('pinataMetadata', metadata);

    const options = JSON.stringify({
        cidVersion: 0,
    });
    data.append('pinataOptions', options);

    const result = await axios({
        url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
        method: 'POST',
        headers: {
            'Content-Type': `multipart/form-data;boundary=----WebKitFormBoundaryyrV7KO0BoCBuDbTL`,
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
        data,
    });

    const image = `https://gateway.pinata.cloud/ipfs/${result.data.IpfsHash}`;

    return image;
};
