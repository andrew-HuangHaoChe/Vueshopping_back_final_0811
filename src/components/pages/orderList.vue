<template>
  <div>       
  <loading :active.sync="isLoading"></loading>
       <table class="table mt-4">
          <thead>
              <th width="120">購買時間</th>
              <th width="200">Email</th>
              <th width="150" class="text-center">購買款項</th>
              <th width="60">應付金額</th>
              <th width="60" class="text-center">是否付款</th>
          </thead>
          <tbody>
              <tr v-for="(item, key) in orders" :key="item.id">
                  <td>{{item.create_at |date}}</td>
                  <td>{{item.user.email}}</td>
                  <td class="text-center">
                    <ul class="list-unstyled">
                      <li v-for="(product, i) in item.products" :key="i">
                        {{ product.product.title }} 
                        {{ product.qty }}
                        {{ product.product.unit }}
                      </li>
                    </ul>
                  </td>
                  <td class="text-right">{{ item.total | currency }}</td>
                  <td class="text-center">
                      <span v-if="item.is_paid" class="text-success">已付款</span>
                      <span v-else>尚未付款</span>
                  </td>
                  
              </tr>
          </tbody>
      </table>
      
      <Pagination :pages="pagination" @pageChange="getOrders"></Pagination>
    

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
            orders:[],
            pagination:{},
            tempProduct:{},
            isNew:false,
            isLoading: false,
        };
    },
    methods:{
        getOrders(page = 1){  //page = 1(ES6用法)帶入預設值為第一頁，他如果有帶數值就會用後來傳入的數值作替代。
            const api=`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/orders?page=${page}`;
            const vm = this;
            console.log(process.env.APIPATH, process.env.CUSTOMPATH);
            vm.isLoading = true;
            this.$http.get(api).then((response) => {
            console.log(response);
            vm.isLoading = false;
            vm.orders = response.data.orders;
            vm.pagination = response.data.pagination;
            });
        },
    },
    created() {
        this.getOrders();  
    },
    
}
</script>
