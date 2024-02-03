import { Autocomplete, Button, TextField } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useEffect, useRef, useState } from "react";
import { stringValidator } from "../../assets/regex";

export default function AddProducts() {
    const inStockVal = ["stock", "stockOut"];
    const onSaleVal = ["onSale", "notSale"];
    const productSizes = ["XS", "S", "M", "L", "XL", "2XL"];

    // Create a ref for the file input
    const fileInputRef = useRef(null);

    // states to save inputs
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [price, setPrice] = useState(0);
    const [newPrice, setNewPrice] = useState(0);
    const [inStock, setInStock] = useState(false);
    const [onSale, setOnSale] = useState(false);
    const [sizes, setSizes] = useState([]);

    // error handling
    const [fileSizeError, seFileSizeError] = useState(false);
    const [titleError, setTitleError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);

    useEffect(() => {
        setTitleError(stringValidator.test(title));
        setDescriptionError(stringValidator.test(description));
    }, [title, description])

    // handle imageUpload
    const handleImageFileChange = (e) => {
        // Access the selected file from event.target.files
        const file = e.target.files[0];
        const maxSize = (1024 / 2) * 1024;
        if (file.size > maxSize) {
            seFileSizeError(true);
        }
        else {
            setFile(file);
            // Create URL for the selected image
            const url = URL.createObjectURL(file);
            setImageUrl(url);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // console.log(title, description, category, price, newPrice, inStock, onSale, sizes, file);

        // Create a FormData object
        const formData = new FormData();

        // Append the inputs and state data to the FormData object
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("price", price);
        formData.append("newPrice", newPrice);
        formData.append("inStock", inStock);
        formData.append("onSale", onSale);

        // Append each size individually
        sizes.forEach(size => {
            formData.append("sizes[]", size);
        });
        // If you want to include the file (image) in the FormData
        if (file) {
            formData.append("image", file);
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

    return (
        <div className="grid gap-5 shadow-md rounded-sm mx-2 sm:mx-4 md:mx-4 lg:mx-4 xl:mx-4 my-2 sm:my-4 md:my-4 lg:my-4 xl:my-4 p-2 sm:p-4 lg:p-4 md:p-4 xl:p-4">
            <h2 className="text-xl font-bold">Add Product</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-5">
                    <div className="flex justify-between gap-2">
                        {/* Product title */}
                        <TextField
                            error={titleError || title.length > 30 || title !== "" && title.length < 5}
                            helperText={titleError ? "Only number not supported" : "MinLength 5 and MaxLength 30"}
                            id="outlined-basic" label="Product Title" variant="outlined" className="w-full"
                            size="small"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        {/* Product description */}
                        <TextField
                            error={descriptionError || description.length > 500 || description !== "" && description.length < 10}
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
                            options={onSaleVal}
                            className="w-full"
                            renderInput={(params) => <TextField {...params} label="Category" />}
                            size="small"
                            required
                        />

                        {/* Sizes */}
                        <Autocomplete
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
                        />

                        {/* InStock */}
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={inStockVal}
                            // sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="InStock" />}
                            className="w-full"
                            size="small"
                            defaultValue={inStockVal[0]}
                            onChange={(e) => {
                                if (e.target.innerText === inStockVal[0]) {
                                    setInStock(true);
                                }
                                else {
                                    setInStock(false)
                                }
                            }
                            }
                            required
                        />

                        {/* OnSale */}
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={onSaleVal}
                            // sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="OnSale" />}
                            className="w-full"
                            size="small"
                            defaultValue={onSaleVal[1]}
                            onChange={(e) => {
                                if (e.target.innerText === onSaleVal[0]) {
                                    setOnSale(true);
                                }
                                else {
                                    setOnSale(false)
                                }
                            }
                            }
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
                            value={newPrice}
                            required
                            onChange={(e) => {
                                if (e.target.value >= 0) {
                                    setNewPrice(e.target.value);
                                }
                            }}
                            disabled={!onSale}
                        />
                    </div>

                    {/* Product Image */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 border border-dashed p-2 rounded-md">
                        <div className="w-full relative">
                            {/* Remove Preview Image */}
                            {file !== null &&
                                <div className="absolute right-0 hover:cursor-pointer"
                                    onClick={() => {
                                        setFile(null);
                                        setImageUrl(null);
                                        // Clear the file input value
                                        fileInputRef.current.value = "";
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            }

                            {imageUrl !== null && <img style={{ maxHeight: "300px", width: "100%" }}
                                src={imageUrl} alt="previewImage"
                                className="rounded-md"
                            />}
                        </div>

                        <div className="w-full">
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleImageFileChange}
                                style={{ display: 'none' }}
                                id="file-input"
                                name="image"
                                ref={fileInputRef}
                            />
                            <label htmlFor="file-input">
                                <Button component="span" variant="contained" startIcon={<CloudUploadIcon />}>
                                    Upload Image
                                </Button>
                            </label>
                            {
                                fileSizeError ?
                                    <p className="text-red-500 mt-2">File size is too big to upload</p>
                                    :
                                    <p className="mt-2 opacity-70">Only supported [.png]/[.jpeg]/[.jpg], maxSize 500KB</p>
                            }

                        </div>
                    </div>

                    {/* Buttons */}
                    <hr />
                    <div className="flex justify-end gap-4">
                        <Button variant="outlined" size="medium">
                            Cancel
                        </Button>

                        <Button variant="contained" size="medium" type="Submit"
                            disabled={(title === "") || (description === "") || (sizes.length === 0) || (file === null)}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}
