import {v2 as cloudinary} from 'cloudinary';
          



const cloudinaryConnection=()=>{cloudinary.config({ 
    cloud_name: 'dt01aqi78', 
    api_key: '515773633222351', 
    api_secret: 'bnYyhI-4iDMI2kqFoOHI5j0rOLY' 
    });
    return cloudinary
}

export default cloudinaryConnection;