import { FC, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuthFeatureStore } from '../../features/auth';

export const Auth: FC = () => {
    const { search } = useLocation();
    const { addUser } = useAuthFeatureStore();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(search);

        const payload = {
            id: params.get('id'),
            username: params.get('username'),
            displayName: params.get('displayName'),
            photoUrl: params.get('photoUrl'),
        };

        addUser(payload);

        navigate('/');
    }, []);

    return <div></div>;
};
