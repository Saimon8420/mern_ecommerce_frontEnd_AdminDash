import loading from "../../assets/loading.svg"
const Loading = () => {
    return (
        <div className="w-1/4 mx-auto my-4">
            <div className="flex gap-2">
                <p>Loading...</p>
                <img className="animate-spin h-7 w-10" src={loading} alt="loading" />
            </div>
        </div>
    );
};

export default Loading;