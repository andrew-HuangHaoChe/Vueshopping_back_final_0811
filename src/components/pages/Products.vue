<template>
  <div>       
  <loading :active.sync="isLoading"></loading>
      <div class="text-right">
          <button class="btn btn-primary mt-4" @click="openModal(true)">建立新的產品</button>
      </div>
      <table class="table mt-4">
          <thead>
              <th width="120">分類</th>
              <th>產品名稱</th>
              <th width="120">原價</th>
              <th width="120">售價</th>
              <th width="100">是否啟用</th>
              <th width="120" class="text-center">編輯</th>
          </thead>
          <tbody>
              <tr v-for="item in products" :key="item.id">
                  <td>{{item.category}}</td>
                  <td>{{item.title}}</td>
                  <td class="text-right">{{item.origin_price | currency}}</td>
                  <td class="text-right">{{item.price | currency}}</td>
                  <td>
                      <span v-if="item.is_enabled" class="text-success">啟用</span>
                      <span v-else>未啟用</span>
                  </td>
                  <td>
                      <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">編輯</button>
                      <button class="btn btn-outline-danger btn-sm" @click="opendeleteModal(item)">刪除</button>
                  </td>
              </tr>
          </tbody>
      </table>
      <Pagination :pages="pagination" @pageChange="getProducts"></Pagination>
    <!--Modal-->
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row">
            <div class="col-sm-4">
                <div class="form-group">
                    <label for="exampleInputEmail1">輸入圖片網址</label>
                    <input type="email" 
                    class="form-control mb-3" 
                    id="image" 
                    aria-describedby="emailHelp" 
                    placeholder="請輸入圖片連結"
                    v-model="tempProduct.imageUrl"
                    >
                </div>
                <div class="form-group">
                    <label for="customFile">或 上傳圖片</label>
                    <i class="fas fa-spinner fa-spin" v-if="status.fileUploading"></i>
                    <input type="file" id="customFile" class="form-control" ref="files" @change="uploadFile">
                </div>  
                <img class="img-fluid" :src="tempProduct.imageUrl" alt=""> 
                </div>
                
            <div class="col-sm-8">
                <div class="form-group">
                    <label for="title">標題</label>
                    <input type="email" class="form-control" id="title" aria-describedby="emailHelp" placeholder="請輸入標題" v-model="tempProduct.title">
                </div>
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input type="text" class="form-control" id="category"
                      v-model="tempProduct.category"
                      placeholder="請輸入分類">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input type="unit" class="form-control" id="unit"
                      v-model="tempProduct.unit"
                      placeholder="請輸入單位">
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">原價</label>
                    <input type="text" class="form-control" id="orgin_price"
                      v-model="tempProduct.origin_price"
                      placeholder="請輸入原價">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input type="unit" class="form-control" id="price"
                      v-model="tempProduct.price"
                      placeholder="請輸入售價">
                  </div>
                </div>
                <hr>
                 <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea type="text" class="form-control" id="description"
                    v-model="tempProduct.description"
                    placeholder="請輸入產品描述"></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea type="text" class="form-control" id="content"
                    v-model="tempProduct.content"
                    placeholder="請輸入產品說明內容"></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox"
                      v-model="tempProduct.is_enabled"
                      :true-value="1"
                      :false-value="0"
                      id="is_enabled">
                    <label class="form-check-label" for="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
        <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
      </div>
      </div>
    </div>
  </div>
<!--刪除modal-->
<div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content border-0">
      <div class="modal-header bg-danger text-white">
        <h5 class="modal-title" id="exampleModalLabel">刪除此商品</h5>
        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
            <div class="col-sm-8">
                <div class="form-group">
                    <label for="exampleInputEmail1">標題</label>
                    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="請輸入標題" v-model="tempProduct.title">
                </div>
            </div>
      </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click="deleteProduct">確認</button>
        </div>
      </div>
    </div>
</div>

</div>
</template>



<script>
import $ from 'jquery';
import Pagination from '../Pagination';
export default {
  components:{
    Pagination,
  },
    data(){
        return {
            products:[],
            pagination:{},
            tempProduct:{},
            isNew:false,
            isLoading: false,
            status:{
              fileUploading:false,
            },
        };
    },
    methods:{
        getProducts(page = 1){  //page = 1(ES6用法)帶入預設值為第一頁，他如果有帶數值就會用後來傳入的數值作替代。
            const api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/products?page=${page}`;
            const vm = this;
            console.log(process.env.APIPATH, process.env.CUSTOMPATH);
            vm.isLoading = true;
            this.$http.get(api).then((response) => {
            console.log(response.data);
            vm.isLoading = false;
            vm.products = response.data.products;
            vm.pagination = response.data.pagination;
            });
        },
        openModal(isNew, item){
            if(isNew){
                this.tempProduct = {};
                this.isNew = true;
            } else {
                this.tempProduct =Object.assign({}, item);  //ES6的寫法可以將item寫入空的物件且避免item與tempProuduct有參考的特性
                this.isNew = false;
            }
             $('#productModal').modal('show');
        },
        opendeleteModal(item){
            this.tempProduct = item;
             $('#deleteModal').modal('show');
             console.log(item);
        },
        updateProduct(){
            let api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product`;
            let httpMethod = 'post';
            const vm = this;
            if(!vm.isNew){
                api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
                httpMethod = 'put';
            }
            console.log(process.env.APIPATH, process.env.CUSTOMPATH);
            this.$http[httpMethod](api, { data: vm.tempProduct }).then((response) => {
            console.log(response.data);
            if(response.data.success){
                $('#productModal').modal('hide');
                vm.getProducts();
            }else{
                $('#productModal').modal('hide');
                vm.getProducts();
                console.log('新增失敗');
                }
            });
        },
        deleteProduct(){
            const vm = this;
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
            console.log(api);
            this.$http.delete(api, vm.tempProduct.id).then((response) =>{
            console.log(response.data);
            if(response.data.success){
                $('#deleteModal').modal('hide');
                vm.getProducts();
            }else{
                $('#deleteModal').modal('hide');
                vm.getProducts();
                console.log('刪除失敗');
                }
            });              
        },
        uploadFile(){
          const uploadedFile = this.$refs.files.files[0];
          const vm = this;
          const formData = new FormData();
          formData.append('file-to-upload', uploadedFile);
          const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/upload`;
          vm.status.fileUploading = true;
          this.$http.post(url, formData, {
            headers:{
              'Content-Type': 'multipart/form-data',
            },
          }).then((response) => {
            console.log(response.data);
            vm.status.fileUploading = false;
            if(response.data.success){
              vm.$set(vm.tempProduct, 'imageUrl' ,response.data.imageUrl);
            }else{
              this.$bus.$emit('message:push', response.data.message, 'danger');
            }
          });
        },
    },
    created() {
        this.getProducts();
        
    },
    
}
</script>
