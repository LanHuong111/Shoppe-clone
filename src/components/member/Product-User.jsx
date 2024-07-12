import { useEffect, useState } from "react";
import Account from "./Account";
import { api } from "../../api";

function ProductUser() {
    const[product, setProduct]  = useState("")

    useEffect(() =>{
        api
        .get("/user/my-product")
        .then((response ) =>{
            console.log(response);
        })
        .catch((error) =>{
            console.log(error);
        })
    }, [])

    return ( 
        <>
        <Account/>
        <div class="col-sm-9">
					<div class="table-responsive cart_info">
						<table class="table table-condensed">
							<thead>
								<tr class="cart_menu">
									<td class="image">Item</td>
									<td class="description"></td>
									<td class="price">Price</td>
									<td class="quantity">Quantity</td>
									<td class="total">Total</td>
									<td></td>
								</tr>
							</thead>
							<tbody>
								
								<tr>
									<td class="cart_product">
										<a href=""><img src="images/cart/one.png" alt=""/></a>
									</td>
									<td class="cart_description">
										<h4><a href="">Colorblock Scuba</a></h4>
										<p>Web ID: 1089772</p>
									</td>
									<td class="cart_price">
										<p>$59</p>
									</td>
									<td class="cart_quantity">
										<div class="cart_quantity_button">
											<a class="cart_quantity_up" href=""> + </a>
											<input class="cart_quantity_input" type="text" name="quantity" value="1" autocomplete="off" size="2"/>
											<a class="cart_quantity_down" href=""> - </a>
										</div>
									</td>
									<td class="cart_total">
										<p class="cart_total_price"></p>
									</td>
									<td class="cart_delete">
										<a class="cart_quantity_delete" href=""><i class="fa fa-times"></i></a>
									</td>
								</tr>
								{/* <tr>
									<td class="cart_product">
										<a href=""><img src="images/cart/one.png" alt=""/></a>
									</td>
									<td class="cart_description">
										<h4><a href="">Colorblock Scuba</a></h4>
										<p>Web ID: 1089772</p>
									</td>
									<td class="cart_price">
										<p>$59</p>
									</td>
									<td class="cart_quantity">
										<div class="cart_quantity_button">
											<a class="cart_quantity_up" href=""> + </a>
											<input class="cart_quantity_input" type="text" name="quantity" value="1" autocomplete="off" size="2"/>
											<a class="cart_quantity_down" href=""> - </a>
										</div>
									</td>
									<td class="cart_total">
										<p class="cart_total_price"></p>
									</td>
									<td class="cart_delete">
										<a class="cart_quantity_delete" href=""><i class="fa fa-times"></i></a>
									</td>
								</tr>
								<tr>
									<td class="cart_product">
										<a href=""><img src="images/cart/one.png" alt=""/></a>
									</td>
									<td class="cart_description">
										<h4><a href="">Colorblock Scuba</a></h4>
										<p>Web ID: 1089772</p>
									</td>
									<td class="cart_price">
										<p>$59</p>
									</td>
									<td class="cart_quantity">
										<div class="cart_quantity_button">
											<a class="cart_quantity_up" href=""> + </a>
											<input class="cart_quantity_input" type="text" name="quantity" value="1" autocomplete="off" size="2"/>
											<a class="cart_quantity_down" href=""> - </a>
										</div>
									</td>
									<td class="cart_total">
										<p class="cart_total_price"></p>
									</td>
									<td class="cart_delete">
										<a class="cart_quantity_delete" href=""><i class="fa fa-times"></i></a>
									</td>
								</tr> */}



							
							</tbody>
						</table>
					</div>
				</div>
        </>
     );
}

export default ProductUser;