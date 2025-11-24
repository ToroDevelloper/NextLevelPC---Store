import React from 'react';
import { useAuthModal } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const AuthModals = () => {
    const { authModal, closeAuthModal } = useAuthModal();

    if (!authModal.isOpen) return null;

    return (
        <div className="modal-fixed-container">
            {authModal.type === 'login' && (
                <LoginModal onClose={closeAuthModal} />
            )}
            {authModal.type === 'register' && (
                <RegisterModal onClose={closeAuthModal} />
            )}
        </div>
    );
};

export default AuthModals;