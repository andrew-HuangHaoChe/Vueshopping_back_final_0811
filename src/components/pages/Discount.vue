<template>
  <div>       
  <loading :active.sync="isLoading"></loading>
  <div class="d-flex justify-content-end">
    <button class="btn btn-outline-primary btn-sm" @click="openDismodal(true)">新增優惠券</button>
  </div>
      <table class="table mt-4">
        <thead>
          <th>產品名稱</th>
          <th>折扣</th>
          <th width="180" class="text-center">到期日</th>
          <th width="180" class="text-center">是否啟用</th>
          <th width="120" class="text-center">編輯</th>
        </thead>
        <tbody>
          <tr v-for="(item) in coupons" :key="item.id">
            <td>{{item.title}}</td>
            <td>{{item.percent}}</td>
            <td class="text-center">{{item.due_date | date}}</td>
            <td class="text-center">
              <span v-if="item.is_enabled" class="text-success">啟用</span>
              <span v-else>未啟用</span>
            </td>
            <td>
              <button class="btn btn-outline-primary btn-sm" @click="openDismodal(false , item)">編輯</button>
              <button class="btn btn-outline-danger btn-sm" @click="delDismodal(item)">刪除</button>
            </td>
          </tr>
        </tbody>  
      </table>
      
      <Pagination :pages="pagination" @pageChange="getCoupons"></Pagination>
      <!--新增modal-->
      <div class="modal fade" id="disModal" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content border-0">
            <div class="modal-header bg-dark text-white">
              <h5 class="modal-title" id="exampleModalLabel">
                <span>新增產品</span>
              </h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-sm-12">
                  <div class="form-group">
                    <label for="title">標題</label>
                    <input type="text" class="form-control" id="title"
                      placeholder="請輸入標題" v-model="tempCoupons.title">
                  </div>
                  <div class="form-group">
                    <label for="code">優惠碼</label>
                      <input type="text" class="form-control" id="code"
                        placeholder="請輸入優惠碼" v-model="tempCoupons.code">
                    </div>
                  
                  <div class="form-group">
                    <label for="due_date">到期日</label>
                    <input type="date" class="form-control" id="due_date"
                      placeholder="請輸入到期日" v-model="due_date">
                  </div>
                  <div class="form-group">
                      <label for="percent">折扣百分比</label>
                      <input type="text" class="form-control" id="percent"
                        placeholder="請輸入折扣百分比" v-model="tempCoupons.percent">
                  </div>
                  <div class="form-group">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox"
                        :true-value="1"
                        :false-value="0"
                        v-model="tempCoupons.is_enabled"
                        id="is_enabled">
                      <label class="form-check-label" for="is_enabled">
                        是否啟用
                      </label>
                    </div>
                  </div>
                </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                  <button type="button" class="btn btn-primary" @click="updataCoupons">確認</button>
                </div>
                </div>
              </div>
            </div>
          </div>
          <!--刪除modal-->
      <div class="modal fade" id="delModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除優惠券</span>
            </h5>
            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col">
                <p class="h3">確認刪除此優惠券?</p>
              </div>
            </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-primary" @click="deleteCoupons">確認</button>
              </div>
              
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
            coupons:[],
            pagination:{},
            tempCoupons:{
              title:'',
              is_enable:0,
              percent:100,
              due_date:0,
              code:'',
            },
            due_date: new Date(),
            isNew:false,
            isLoading: false,
            status:{
              fileUploading:false,
            },
        };
    },
    watch:{
      due_date(){
            const vm = this;
            const timestamp = Math.floor(new Date(vm.due_date) / 1000);
            vm.tempCoupons.due_date = timestamp;
            console.log(timestamp);
      },
    },
    methods:{
      getCoupons(page = 1){  //page = 1(ES6用法)帶入預設值為第一頁，他如果有帶數值就會用後來傳入的數值作替代。
            const api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`;
            const vm = this;
            console.log(process.env.APIPATH, process.env.CUSTOMPATH);
            vm.isLoading = true;
            this.$http.get(api).then((response) => {
            console.log(response.data);
            vm.isLoading = false;
            vm.coupons = response.data.coupons;
            vm.pagination = response.data.pagination;
            });
        },
        openDismodal(isNew, item){
          const vm = this;
          $('#disModal').modal('show');
          vm.isNew = isNew;
          if(isNew){
            vm.tempCoupons={};
          }else{
            vm.tempCoupons=Object.assign({},item);
            const dateAndtime = new Date(vm.tempCoupons.due_date * 1000).toISOString().split('T');
            vm.due_date = dateAndtime[0];
          }
        },
        updataCoupons(){
            const vm = this;
            if(vm.isNew){
              const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
              this.$http.post(api,{ data: vm.tempCoupons }).then((response) => {
                console.log(response,vm.tempCoupons);
                $('#disModal').modal('hide');
                vm.getCoupons();
              });
            }else{
              const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupons.id}`;
              vm.due_date = new Date(vm.tempCoupons.due_date*1000);
              this.$http.put(api,{ data: vm.tempCoupons }).then((response) => {
                console.log(response);
                $('#disModal').modal('hide');
                vm.getCoupons();
              });
            }
            //vm.pagination = response.data.pagination;
        },
        delDismodal(item){
          this.tempCoupons = item;
          $('#delModal').modal('show');
        },
        deleteCoupons(){
          const vm = this;
          let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupons.id}`;
            console.log(api);
            this.$http.delete(api, vm.tempCoupons.id).then((response) =>{
            console.log(response.data);
            if(response.data.success){
                $('#delModal').modal('hide');
                vm.getCoupons();
            }else{
                $('#delModal').modal('hide');
                vm.getCoupons();
                console.log('刪除失敗');
                }
            }); 
        },
    },
    created() {
        this.getCoupons();  
    },
    
}
</script>
