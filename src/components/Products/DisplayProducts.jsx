import { useEffect, useState } from "react";
import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
const DisplayProducts = () => {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch("http://localhost:9000/product/allProduct");
            const res = await data.json();
            setProducts(res?.data);
        }
        fetchData();
    }, []);
    const navigate = useNavigate();
    return (
        <div className="m-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {
                    products.map(each =>
                        <div className="p-1 rounded-md shadow-md flex flex-col gap-1" key={each._id}>
                            {/* Images */}
                            <div className="flex items-center justify-center gap-2">
                                {each?.image?.map(each => <img className="w-1/5 sm:w-1/4 md:w-1/4 lg:w-1/4 xl:w-1/4 rounded-sm" key={each?._id} src={each?.secure_url} alt="" />
                                )
                                }
                            </div>
                            <hr />

                            {/* Product Info */}
                            <div className="grid grid-cols-2 gap-2 p-2">
                                <div className="text-left flex flex-col gap-2 pl-4 capitalize">
                                    <h2 className="font-bold text-md">{each.title}</h2>
                                    <p className="text-sm font-semibold">{each?.category?.title}</p>
                                    <p className="text-sm font-bold">{each?.onSale === true ? <s>&#2547; {each?.price}</s> : <>&#2547;{each?.price}</>}
                                    </p>
                                    <p className="text-sm font-bold">{each?.inStock === true ? "In-Stock" : <s>Stock-Out</s>}</p>
                                    <p>{each?.onSale === true && <>&#2547;{each?.newPrice}</>}</p>
                                </div>
                                <div className="bg-gray-50 rounded p-1 capitalize">
                                    <p className="text-sm text-left break-words">{each?.description}</p>
                                </div>
                            </div>
                            <hr />

                            {/* Buttons */}
                            < div className="flex gap-2 justify-end my-2 mx-1">
                                <Button variant="outlined">
                                    <DeleteTwoToneIcon />
                                </Button>
                                <Button variant="contained" onClick={() => navigate(`/update/${each?._id}`)}>
                                    <BorderColorTwoToneIcon />
                                </Button>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default DisplayProducts;