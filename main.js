var percentageCotton = 80
var percentagePolyester = 20

Vue.component('product',{
    props: {
        premium:{
            type: Boolean,
            required: true
        }
    },
    template: `
    <div>
        <div class="product">
            <div class="product-image">
                <img v-bind:src="image" v-bind:alt="altText">
            </div>
            <div class="product-info">
                <h1>{{title}}</h1> 
                <h2>{{sale}}</h2> 
                <p>User is premium: {{premium}}</p>
                <p>{{description}}</p>

                <span :class="{ inStock: !inStock }">In stock</span> 
                <!-- 
                <ul v-for="detail in details">
                <li>{{detail}}</li>
                </ul>
                -->
                <product-details :details="details"></product-details>

                <div v-for="(variant, index) in variants" :key="variant.variantId" class="color-box"
                    :style="{ backgroundColor: variant.variantColor }" 
                    @mouseover="updateProduct(index); onSale = variant.variantOnSale"> 
                </div>
                <div><a v-bind:href="anchorLink">Link to VueJs lesson 2</a></div>
                <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button>
                <br>
                <button v-on:click="removeFromCart">Remove from cart</button> 
            </div>
        </div>
        <product-review @review-submitted="addReview"></product-review> 
        <div>
            <h2>Reviews</h2>
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
                <li v-for="review in reviews">
                    <p>User: {{ review.name }}</p>
                    <p>Rating: {{ review.rating }}</p>
                    <p>Review: {{ review.review }}</p>
                    <p>Recommendation: {{ review.recommendation}}</p>
                </li>
            </ul>
        </div>
    </div>
    `,
    data() {return {
        brand: "Vue mastery" ,
        product: 'socks',
        //image: './assets/images/socks_blue.jpg',
        selectedProduct: 0,
        altText : 'blue socks image',
        variants: [
            {
                variantId:10102, 
                variantColor:'blue', 
                variantImg:'./assets/images/socks_blue.jpg',
                variantQuanity: 10,
                variantOnSale: true
            },
            {
                variantId:25421, 
                variantColor:'green', 
                variantImg:'./assets/images/socks_green.jpg',
                ariantQuanity: 0,
                variantOnSale: false
            }
        ],
        description: 'A pair of warm, fuzzy stocks',
        onSale: true,
        //inStock: true,
        details: [`cotton: ${percentageCotton}%`, `polyester: ${percentagePolyester}%`],
        anchorLink: 
        'https://www.vuemastery.com/courses/intro-to-vue-js/attribute-binding',
        reviews: [],
        }
    },
    methods: {
        addToCart(){
            this.$emit('add-to-cart', this.variants[this.selectedProduct].variantId)
        },
        removeFromCart(){ //challenge 9
            this.$emit('remove-from-cart') 
        },
        // updateProduct: function(variantImg){
        //     this.image = variantImg
        // },
        updateProduct: function(index){
            this.selectedProduct = index
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        }
    },
    computed:{
        title(){
            return this.brand + ' ' + this.product
        },
        image(){
            return this.variants[this.selectedProduct].variantImg
        },
        inStock(){
            return this.variants[this.selectedProduct].variantQuanity
        },
        sale(){
            if(this.onSale){
                return this.brand + ' ' + this.product + ' are on sale'
            }
            else{
                return this.brand + ' ' + this.product + ' are not on sale'
            }
        }
    }
})

Vue.component('product-review',{
    template:`
    <form class="review-form" @submit.prevent="onSubmit">
        <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
            <li v-for="error in errors">{{ error }}</li>
        </ul>
        </p>
        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name" placeholder="name">
        </p>
        
        <p>
            <label for="review">Review:</label>      
            <textarea id="review" v-model="review"></textarea>
        </p>
        
        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
            </select>
        </p>
        <p>
            <label for="Yes">Yes, I recommend this product</label>
            <input type="radio" name="recommendation" checked id="Yes" v-model="recommendation" value="Yes">
            <label for="No">No, I not recommend this product</label>
            <input type="radio" name="recommendation" id="No" v-model="recommendation" value="No">
        </p>

        <p>
            <input type="submit" value="Submit">  
        </p>    
    
    </form>
    `,
    data() {
        return{
            name: null,
            review: null,
            rating: null,
            recommendation: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if(this.name && this.review && this.rating && this.recommendation) {
                let productReview = {
                  name: this.name,
                  review: this.review,
                  rating: this.rating,
                  recommendation: this.recommendation,
                }
                this.$emit('review-submitted', productReview)
                this.name = null;
                this.review = null;
                this.rating = null;
                this.recommendation = null;
            } else {
                this.errors = [];
                if(!this.name) this.errors.push("Name required.");
                if(!this.review) this.errors.push("Review required.");
                if(!this.rating) this.errors.push("Rating required.");
                if(!this.recommendation) this.errors.push("Recommend required.");
            }
          }
    }
})

// challenge 8 
Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template:`
    <div>
        <ul v-for="detail in details">
            <li>{{detail}}</li>
        </ul>
    </div>
    `,
})

var app = new Vue({
    el: '#app',
    data:{
        premium: true,
        cart: [],
    },
    methods: {
        addToCart: function(id){
            this.cart.push(id)
        },
        removeFromCart: function(){ // challenge 9
            if(this.cart.length > 0){
                this.cart.pop()
            }
        },
    }
})



