
export const convertDMSToDD = (dms, ref) => {
    if (!dms || dms.length < 3) return null;
    let dd = dms[0] + dms[1] / 60 + dms[2] / 3600;
    if (ref === 'S' || ref === 'W') {
        dd = dd * -1;
    }
    return dd;
};

export const getLocationFromImage = (file, EXIF) => {
    return new Promise((resolve, reject) => {
        EXIF.getData(file, function () {
            const latData = EXIF.getTag(this, "GPSLatitude");
            const latRef = EXIF.getTag(this, "GPSLatitudeRef");
            const lngData = EXIF.getTag(this, "GPSLongitude");
            const lngRef = EXIF.getTag(this, "GPSLongitudeRef");

            if (latData && latRef && lngData && lngRef) {
                const lat = convertDMSToDD(latData, latRef);
                const lng = convertDMSToDD(lngData, lngRef);
                resolve({ lat, lng });
            } else {
                resolve(null);
            }
        });
    });
};
