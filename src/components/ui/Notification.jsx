import React, { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const Notification = ({ type = 'success', message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!message) return null;

    const isSuccess = type === 'success';

    return (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg text-white ${isSuccess ? 'bg-green-600' : 'bg-red-600'}`}>
            {isSuccess ? <CheckCircle size={20} className="mr-2" /> : <XCircle size={20} className="mr-2" />}
            <span className="font-medium">{message}</span>
        </div>
    );
};

export default Notification;
