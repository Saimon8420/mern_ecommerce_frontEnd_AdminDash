import { Autocomplete, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { stringValidator } from "../../assets/regex";
import Loading from "../Loading/Loading";
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
const UpdateProduct = () => {
    const params = useParams();
    const [loading, setLoading] = useState(false);

    const inStockVal = ["stock", "stockOut"];
    const onSaleVal = ["notSale", "onSale"];
    const productSizes = ["XS", "S", "M", "L", "XL", "2XL"];
    // states to save inputs
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [loadCategory, setLoadCategory] = useState([]);
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [price, setPrice] = useState(0);
    const [newPrice, setNewPrice] = useState(0);
    const [inStock, setInStock] = useState(true);
    const [onSale, setOnSale] = useState(false);
    const [sizes, setSizes] = useState([]);

    // error handling
    const [fileSizeError, setFileSizeError] = useState(false);
    const [titleError, setTitleError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);

    // Load each product Data
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const getData = await fetch(`http://localhost:9000/product/${params?.id}`);
            const res = await getData.json();
            console.log(res?.data);
            setTitle(res?.data?.title);
            setDescription(res?.data?.description);
            setSizes(res?.data?.sizes);
            setCategory(res?.data?.category);
            setInStock(res?.data?.inStock);
            setOnSale(res?.data?.onSale);
            setPrice(res?.data?.price);
            setNewPrice(res?.data?.newPrice);
            setLoading(false);
            setImageUrl(res?.data?.image.map(each => {
                return each;
            }));
            setFile(res?.data?.image.map(each => {
                return each;
            }));
        }
        fetchData();
    }, [params?.id]);

    // console.log(imageUrl);

    // load category
    useEffect(() => {
        const loadCategory = async () => {
            const data = await fetch("http://localhost:9000/category/all");
            const res = await data.json();
            setLoadCategory(res.data);
        }
        loadCategory();
    }, []);

    // validation
    useEffect(() => {
        setTitleError(stringValidator.test(title));
        setDescriptionError(stringValidator.test(description));
    }, [title, description])

    // handle imageUpload
    const handleImageFileChange = (e) => {
        if (imageUrl.length === 3) {
            alert("Can't upload more than 3 files");
        }
        else {
            // Access the selected file from event.target.files
            const files = e.target.files;
            const maxSize = (1024 / 2) * 1024;
            // to store files
            const fileList = [];
            if (files?.length > 3) {
                alert("Maximum file limit crossed!");
            }
            else {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i]; //local file variable
                    if (file?.size > maxSize) {
                        setFileSizeError(true);
                    }
                    else {
                        fileList.push(file);
                        setFileSizeError(false);
                    }
                }
                // storing file into states
                if (file === null) {
                    setFile(fileList);
                }
                else {
                    const totalLength = file?.length + fileList?.length;
                    if (totalLength <= 3) {
                        setFile([...file, ...fileList]);
                    }
                    else {
                        alert("Maximum file limit crossed!");
                    }
                }

                // Create URL for the selected image
                const objectURLs = []; // Array to store object URLs for each file
                for (let i = 0; i < files.length; i++) {
                    const eachFile = fileList[i];
                    const url = URL.createObjectURL(eachFile); // Create object URL for each file
                    objectURLs.push(url); // Store the object URL in the array
                }
                // storing file into imageUrlState
                if (imageUrl === null) {
                    setImageUrl(objectURLs);
                }
                else {
                    const totalLength = imageUrl?.length + objectURLs?.length;
                    console.log(objectURLs);
                    if (totalLength <= 3) {
                        const secureUrls = objectURLs.map(url => ({ secure_url: url }));
                        setImageUrl([...imageUrl, ...secureUrls]);
                    }
                }
            }
        }
    };

    console.log(file);
    console.log(imageUrl);

    // handle RemoveImage
    const [removeImage, setRemoveImage] = useState([]); // store remove image to send it backend, from here it will deleted
    const handleRemoveImage = (indexToRemove) => {
        const confirm = prompt("Image will remove permanently. Sure to remove this permanently? then type 'yes' or 'y' ");
        console.log(confirm);
        if (confirm !== null && confirm?.toLowerCase() === "yes" || confirm?.toLocaleLowerCase() === "y") {
            const updatedImageUrl = imageUrl.filter((_, index) => index !== indexToRemove);
            const updateFile = file.filter((_, index) => index !== indexToRemove);
            const exist = imageUrl.find((_, index) => index === indexToRemove);
            setRemoveImage([...removeImage, exist]);
            setFile(updateFile);
            setImageUrl(updatedImageUrl);

            // Get the file input element
            const fileInput = document.getElementById("file-input");

            // Get the files from the file input element
            const files = fileInput?.files;

            // Create a new FileList object to hold files you want to keep
            const filesToKeep = new DataTransfer();

            // Loop through the files and add files to the filesToKeep DataTransfer object
            for (let i = 0; i < files.length; i++) {
                if (i !== indexToRemove) {
                    filesToKeep.items.add(files[i]);
                }
            }
            // Assign the filesToKeep DataTransfer object back to the file input element
            fileInput.files = filesToKeep.files;
        }
    };

    // send removed Image to Server
    useEffect(() => {

    }, []);

    // console.log(removeImage);

    //  handleFileSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // console.log(title, description, category, price, newPrice, inStock, onSale, sizes, file);

        // Create a FormData object
        const formData = new FormData();

        // Append the inputs and state data to the FormData object
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", category?._id);
        formData.append("price", price);
        formData.append("newPrice", newPrice);
        formData.append("inStock", inStock);
        formData.append("onSale", onSale);

        // Append each size individually
        sizes.forEach(size => {
            formData.append("sizes[]", size);
        });

        // if we want to include the file (image) in the FormData && Append each image individually
        if (file) {
            file.forEach(each => {
                formData.append("images", each);
            })
        }
        // Log the contents of formData, without this loop approach formData will gives empty output when we console it.
        // for (const pair of formData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        // Now we can use the formData object as needed, for example, send it in an HTTP request
        // Example using fetch:
        await fetch("http://localhost:9000/product/addProduct", {
            method: "POST",
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                console.log("Form submitted successfully:", data);
                // Handle success or perform additional actions
            })
            .catch(error => {
                console.error("Error submitting form:", error);
                // Handle errors
            });
    }

    const navigate = useNavigate();

    return (
        <>
            {
                loading ? <Loading /> : <div className="grid gap-5 shadow-md rounded-sm mx-2 sm:mx-4 md:mx-4 lg:mx-4 xl:mx-4 my-2 sm:my-4 md:my-4 lg:my-4 xl:my-4 p-2 sm:p-4 lg:p-4 md:p-4 xl:p-4">
                    <h2 className="text-xl font-bold">Update Product</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-5">

                            <div className="flex justify-between gap-2">
                                {/* Product title */}
                                <TextField
                                    error={titleError || title?.length > 30 || title !== "" && title?.length < 5}
                                    helperText={titleError ? "Only number not supported" : "MinLength 5 and MaxLength 30"}
                                    id="outlined-basic" label="Product Title" variant="outlined" className="w-full"
                                    size="small"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                                {/* Product description */}
                                <TextField
                                    error={descriptionError || description?.length > 500 || description !== "" && description?.length < 10}
                                    helperText={descriptionError ? "Only number not supported" : "MinLength 10 and MaxLength 500"}
                                    id="outlined-multiline-static"
                                    label="Description"
                                    multiline
                                    rows={4}
                                    placeholder="Enter product description here..."
                                    className="w-full"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    max={500}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-y-6 gap-x-2 lg:grid-cols-3">
                                {/* Product Category */}
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={loadCategory.map(each => each?.title)}
                                    className="w-full"
                                    renderInput={(params) =>
                                        <TextField {...params} label="Category" />
                                    }
                                    onChange={(e, selectedValues) => {
                                        if (selectedValues !== null) {
                                            const matched = loadCategory.find(each => each?.title?.includes(selectedValues));
                                            setCategory(matched);
                                        }
                                        else {
                                            setCategory("");
                                        }
                                    }}
                                    size="small"
                                    required
                                    value={category?.title}
                                />

                                {/* Sizes */}
                                <Autocomplete
                                    disabled={
                                        category !== null && !category?.title?.includes("clothing")
                                    }
                                    disablePortal
                                    id="combo-box-demo"
                                    options={productSizes}
                                    className="w-full"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Sizes"
                                        />
                                    )}
                                    // When using multiple={true} in the Autocomplete component, selectedValues will be an array containing the selected options.
                                    //The selectedValues parameter contains the selected values based on user interactions.
                                    onChange={(event, selectedValues) => {
                                        // console.log(selectedValues); // This will log an array of selected values
                                        setSizes(selectedValues);
                                    }}
                                    size="small"
                                    multiple={true}
                                    required
                                    value={sizes}
                                />

                                {/* InStock */}
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={inStockVal}
                                    renderInput={(params) => <TextField {...params} label="InStock" />}
                                    className="w-full"
                                    size="small"
                                    onChange={(e) => {
                                        if (e.target.innerText === inStockVal[0]) {
                                            setInStock(true);
                                        }
                                        else {
                                            setInStock(false)
                                        }
                                    }
                                    }
                                    value={inStock === true ? inStockVal[0] : inStockVal[1]}
                                    required
                                />

                                {/* OnSale */}
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={onSaleVal}
                                    renderInput={(params) => <TextField {...params} label="OnSale" />}
                                    className="w-full"
                                    size="small"
                                    onChange={(e) => {
                                        if (e.target.innerText === onSaleVal[0]) {
                                            setOnSale(false);
                                        }
                                        else {
                                            setOnSale(true)
                                        }
                                    }
                                    }
                                    value={onSale === false ? onSaleVal[0] : onSaleVal[1]}
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                {/* Product Price */}
                                <TextField id="outlined-basic" label="Product Price" variant="outlined"
                                    className="w-full"
                                    size="small"
                                    type="number"
                                    value={price}
                                    required
                                    onChange={(e) => {
                                        if (e.target.value >= 0) {
                                            setPrice(e.target.value);
                                        }
                                    }}
                                />

                                {/* New Price*/}
                                <TextField
                                    id="outlined-basic" label="New Price" variant="outlined"
                                    className="w-full"
                                    size="small"
                                    type="number"
                                    value={newPrice === null && 0}
                                    required
                                    onChange={(e) => {
                                        if (e.target.value >= 0) {
                                            setNewPrice(e.target.value);
                                        }
                                    }}
                                    disabled={!onSale}
                                />
                            </div>

                            <div className="border border-dashed rounded-md p-1">

                                {/* Product Image */}
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 p-2 rounded-md">
                                    {imageUrl !== null && imageUrl.map((each, index) => (
                                        <div key={index} className="relative">
                                            {/* Remove Preview Image */}
                                            <div className="absolute top-0 right-0 hover:cursor-pointer"
                                                onClick={() => handleRemoveImage(index)}
                                            >
                                                <p className="text-red-500"><DeleteTwoToneIcon /></p>
                                            </div>
                                            <img style={{ maxHeight: "300px", width: "100%", marginBottom: "10px" }}
                                                src={each?.secure_url} alt={`previewImage-${index}`}
                                                className="rounded-md"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="w-full">
                                    <input
                                        disabled={file?.length >= 3}
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={handleImageFileChange}
                                        style={{ display: 'none' }}
                                        id="file-input"
                                        name="image"
                                        multiple
                                    />

                                    <label htmlFor="file-input">
                                        <Button
                                            disabled={file?.length >= 3}
                                            component="span" variant="contained" startIcon={<CloudUploadIcon />}>
                                            Upload Image
                                        </Button>
                                    </label>
                                    {
                                        file !== null &&
                                        <p className="my-2">{document.getElementById("file-input")?.files?.length} file selected</p>
                                    }
                                    {
                                        fileSizeError ?
                                            <p className="text-red-500 mt-2">File size is too big to upload</p>
                                            :
                                            <p className="mt-2 opacity-60">Only supported [.png*/.jpeg*/.jpg*]
                                                <br />Maximum limit 3 image
                                                <br />MaxSize each image 500KB</p>
                                    }
                                </div>
                            </div>

                            {/* Buttons */}
                            <hr />
                            <div className="flex justify-end gap-4">
                                <Button variant="outlined" size="medium" onClick={() => navigate("/")}>
                                    Cancel
                                </Button>

                                {/* <Button variant="contained" size="medium" type="Submit"
                                    disabled={(title === "") || (description === "") || (!file === null || !file?.length === 0) || (category === "") || (!price > 0)}
                                >
                                    Submit
                                </Button> */}
                            </div>
                        </div>
                    </form>
                </div>
            }
        </>
    )
};

export default UpdateProduct;