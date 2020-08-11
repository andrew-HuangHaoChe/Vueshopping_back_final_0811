<template>
    <div> 
        <loading :active.sync="isLoading"></loading>
        <div class="row mt-4">
            <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
                <div class="card border-0 shadow-sm">
                  <div style="height: 150px; background-size: cover; background-position: center" :style="{ backgroundImage:`url(${item.imageUrl})` }"
                    >
                  </div>
                  <div class="card-body">
                    <span class="badge badge-secondary float-right ml-2">{{item.category}}</span>
                    <h5 class="card-title">
                      <a href="#" class="text-dark">{{item.title}}</a>
                    </h5>
                    <p class="card-text">{{item.content}}</p>
                    <div class="d-flex justify-content-between align-items-baseline">
                      <div class="h5" v-if="!item.price">{{item.origin_price}} 元</div>
                      <del class="h6">原價 {{item.origin_price}} 元</del>
                      <div class="h5">現在只要 {{item.price}} 元</div>
                    </div>
                  </div>
                  <div class="card-footer d-flex">
                    <button type="button" class="btn btn-outline-secondary btn-sm" @click="getproduct(item.id)">
                      <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                      查看更多
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addtoCart(item.id)">
                      <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                      加到購物車
                    </button>
                  </div>
                </div>
              </div>
        </div>
        <div class="table-responsive-md mx-auto mt-4" style="width:500px;" v-if="cart.final_total!==0">
            <table class="table">
                <thead>
                    <th></th>
                    <th>品名</th>
                    <th class="text-center" width="100">數量</th>
                    <th class="text-center" width="120">單價</th>
                </thead>
                <tbody>
                   <tr v-for="commodity in cart.carts" :key="commodity.id">
                        <td><button class="btn btn-outline-danger" @click="removeCartItem(commodity.id)"><i class="far fa-trash-alt"></i></button></td>
                        <td>
                            {{ commodity.product.title }}
                            <div class="text-success" v-if="commodity.coupon">
                                已套用優惠券
                            </div>
                        </td>
                        <td class="text-center">{{ commodity.qty }}</td>
                        <td class="text-right">{{ commodity.final_total | currency }}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" class="text-right">總計: </td>
                        <td class="text-right">{{cart.total}}</td>
                    </tr>
                     <tr v-if="cart.final_total !== cart.total">
                        <td colspan="3" class="text-right text-success">折扣價:</td>
                        <td class="text-right text-success">{{cart.final_total}}</td>
                     </tr>
                    
                </tfoot>
            </table>
            <div class="input-group mb-3 input-group-sm">
                <input type="text" class="form-control" v-model="coupon_code" placeholder="請輸入優惠碼">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" @click="addCouponcode">
                        套用優惠碼
                    </button>
                </div>
            </div>
        </div>
        <!--驗證結帳表單-->
        <ValidationObserver ref="observer" v-slot="{ invalid }" tag="form">
        <div class="my-5 row justify-content-center">
            <form class="col-md-6" @submit.prevent="createOrder">
              <div class="form-group">
                <label for="useremail">Email</label>
                <ValidationProvider name="郵件" rules="required|email" v-slot="{ errors }">
                    <input type="email" class="form-control" name="email" id="useremail"
                    v-model="form.user.email" placeholder="請輸入 Email" required>
                    <span class="text-danger">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            
              <div class="form-group">
                <label for="username">收件人姓名</label>
                <ValidationProvider name="姓名" rules="required" v-slot="{ errors }">
                    <input type="text" class="form-control" name="姓名" id="username"
                    v-model="form.user.name" placeholder="輸入姓名">
                    <span class="text-danger">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            
              <div class="form-group">
                <label for="usertel">收件人電話</label>
                <ValidationProvider name="電話" rules="required" v-slot="{ errors }">
                    <input type="tel" class="form-control" id="usertel" v-model="form.user.tel" placeholder="請輸入電話">
                    <span class="text-danger">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            
              <div class="form-group">
                <label for="useraddress">收件人地址</label>
                <ValidationProvider name="地址" rules="required" v-slot="{ errors }">
                    <input type="text" class="form-control" name="address" id="useraddress" v-model="form.user.address"
                    placeholder="請輸入地址">
                    <span class="text-danger">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            
              <div class="form-group">
                <label for="comment">留言</label>
                <textarea name="" id="comment" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
              </div>
              <div class="text-right">
                <button class="btn btn-danger" :disabled="invalid">送出訂單</button>
              </div>
            </form>
          </div>
        </ValidationObserver>
         <!--Modal-->
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-light border-0">
                        <h5 class="modal-title" id="exampleModalLabel">{{product.title}}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body pt-0">
                        <div class="row  px-3">
                            <img :src="product.imageUrl" class="img-fluid mx-auto" style="height: 450px; width: 100%;" alt="">
                            <blockquote class="blockquote">
                                <p class="mb-0">{{product.content}}</p>
                                <footer class="blockquote-footer">{{product.description}}</footer>
                            </blockquote>
                            <div class="d-flex justify-content-between align-items-baseline w-100">
                                <div class="h5" v-if="!product.price">{{product.origin_price}} 元</div>
                                <del class="h6" v-if="product.price">原價 {{product.origin_price}} 元</del>
                                <div class="h5" v-if="product.price">現在只要 {{product.price}} 元</div>
                            </div>
                            <select name="" class="from-control mt-3 w-100" v-model="product.num">
                                <option :value="num" v-for="num in 10" :key="num">
                                    選購{{num}} {{product.unit}}
                                </option>
                            </select>
                        </div>
                        <div class="modal-footer">
                            <div class="text-muted text-nowrap mr-3">
                                小計<strong>{{product.num * product.price}}</strong>元
                            </div>
                            <button type="button" class="btn btn-primary" @click="addtoCart(product.id, product.num)">
                                加到購物車
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
    import $ from 'jquery';
    export default{
        data(){
            return{
                cart:[],
                products:[],
                product:{},
                isLoading:false,
                status:{
                    loadingItem:'',
                },
                coupon_code:'',
                form: {
                    user: {
                        name:'',
                        email:'',
                        tel:'',
                        address:'',
                    },
                    message:'',
                },
            };
        },
        methods:{
            getproducts(page = 1){
                const api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products?page=${page}`;
                const vm = this;
                vm.isLoading = true;
                this.$http.get(api).then((response) => {
                console.log(response.data);
                vm.isLoading = false;
                vm.products = response.data.products;
                });
            },
            getproduct(id){
                const api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`;
                const vm = this;
                vm.status.loadingItem = id;
                this.$http.get(api).then((response) => {
                    vm.product = response.data.product;
                    response.data.product.num = 1;
                    $('#productModal').modal('show');
                    console.log(response);
                    vm.status.loadingItem = '';
                });
            },
            addtoCart(id, qty = 1){
                const api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
                const vm = this;
                vm.status.loadingItem = id;
                const cart = {
                    product_id: id,
                    qty, 
                }
                this.$http.post(api, {data: cart}).then((response) => {
                    console.log(response);
                    vm.status.loadingItem = '';
                    vm.getCart();
                    $('#productModal').modal('hide');
                });
                
            },
            getCart(){
                const api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
                const vm = this;
                vm.isLoading = true;
                this.$http.get(api).then((response) => {
                console.log(response.data);
                vm.cart = response.data.data;
                vm.isLoading = false;
                });
            },
            total(){
                const vm = this;
                let arr = 0;
                for(let item in cart){
                    if(typeof vm.cart[item] ==='final_total'){
                        arr += vm.cart[item];
                    }  
                }
            },
            removeCartItem(id){
                const api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
                const vm = this;
                vm.isLoading = true;
                this.$http.delete(api).then((response) => {
                console.log(response.data);
                vm.getCart();
                vm.isLoading = false;
                });
            },
            addCouponcode(){
                const api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`;
                const vm = this;
                const coupon = {
                    code: vm.coupon_code
                }
                vm.isLoading = true;
                this.$http.post(api ,{data: coupon}).then((response) => {
                console.log(response);
                vm.getCart();
                vm.isLoading = false;
                });
            },
            createOrder(){
                const api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`;
                const vm = this;
                const order = vm.form;
                vm.isLoading = true;
                this.$http.post(api,{data: order}).then((response) => {
                console.log('訂單已建立',response);
                if(response.data.success){
                    vm.$router.push(`/customer_checkout/${response.data.orderId}`);
                }
                vm.isLoading = false;
                });
            },
        },
        created(){
            this.getproducts();
            this.getCart();
        }, 
    };
</script>