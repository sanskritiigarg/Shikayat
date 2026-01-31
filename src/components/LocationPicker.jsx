
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { Search, MapPin, Navigation, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Fix for default marker icon in Leaflet with React
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ position, setPosition }) => {
    const map = useMap(); // Get map instance

    // Update map view when position changes (e.g. from search)
    React.useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

const LocationPicker = ({ onConfirm, onClose, initialLocation }) => {
    const defaultCenter = { lat: 28.6139, lng: 77.2090 }; // Default: New Delhi
    const [position, setPosition] = useState(initialLocation || defaultCenter);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();

            if (data && data.length > 0) {
                if (data.length === 1) {
                    // Direct select if only 1 result
                    const result = data[0];
                    const newPos = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
                    setPosition(newPos);
                    setSearchResults([]);
                    toast.success('Location found');
                } else {
                    // Show list
                    setSearchResults(data);
                }
            } else {
                toast.error('Location not found');
            }
        } catch (error) {
            console.error(error);
            toast.error('Search failed');
        } finally {
            setIsSearching(false);
        }
    };

    const selectResult = (result) => {
        const newPos = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
        setPosition(newPos);
        setSearchResults([]);
        setSearchQuery(''); // Close/Clear search
    };

    const handleCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        setIsSearching(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setPosition({ lat: latitude, lng: longitude });
                setIsSearching(false);
                toast.success('Current location located!');
            },
            (err) => {
                console.error(err);
                toast.error('Unable to retrieve your location');
                setIsSearching(false);
            }
        );
    };

    const handleConfirm = () => {
        onConfirm(position);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl w-full max-w-2xl h-[600px] flex flex-col shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Select Location</h3>
                        <p className="text-sm text-slate-500">Tap map, search, or use current location</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Search & Actions Bar */}
                <div className="flex gap-2 mb-4 relative z-[1000]">
                    <div className="flex-1 relative">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search places..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                            />
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <button type="submit" className="hidden" />
                        </form>

                        {/* Search Results Dropdown */}
                        {searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-100 max-h-60 overflow-y-auto z-50">
                                {searchResults.map((result, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => selectResult(result)}
                                        className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 text-sm text-slate-700 truncate"
                                    >
                                        {result.display_name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleCurrentLocation}
                        disabled={isSearching}
                        className="px-3 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 shadow-sm flex items-center justify-center disabled:opacity-50"
                        title="Use Current Location"
                    >
                        {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
                    </button>
                </div>

                <div className="flex-1 rounded-xl overflow-hidden border border-slate-200 relative">
                    <MapContainer
                        center={initialLocation || defaultCenter}
                        zoom={15}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <LocationMarker position={position} setPosition={setPosition} />
                    </MapContainer>
                </div>

                <div className="mt-6 flex justify-between gap-3 items-center">
                    <p className="text-sm text-slate-500 hidden sm:block">
                        Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}
                    </p>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button
                            onClick={onClose}
                            className="flex-1 sm:flex-none px-5 py-2.5 text-slate-700 hover:bg-slate-50 border border-slate-300 rounded-xl font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 sm:flex-none px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
                        >
                            Confirm Location
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationPicker;
