import { useLoader } from '../Providers/LoaderProvider';
import '../../styles/loader.css';

const Loader = () => {
    const { isLoading } = useLoader();

    if (!isLoading) return null;

    return (
        <div className="loader-overlay">
            <div className="loader"></div>
        </div>
    );
};

export default Loader;
