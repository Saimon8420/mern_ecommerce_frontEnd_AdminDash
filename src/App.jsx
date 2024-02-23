import { Route, Routes } from "react-router-dom"
import AddProducts from "./components/Products/AddProducts"
import DisplayProducts from "./components/Products/DisplayProducts"
import NotFound from "./components/NotFound/NotFound"
import UpdateProduct from "./components/Products/UpdateProduct"

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<DisplayProducts />}></Route>

        <Route path="/addProduct" element={<AddProducts />}></Route>

        <Route path="/update/:id" element={<UpdateProduct />}></Route>

        <Route path="*" element={<NotFound />}></Route>

      </Routes>
    </div>
  )
}

export default App
