import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { 
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut 
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { 
    getDatabase, ref, onValue, push, set, remove 
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

// --- 1. Firebase Configuration ---
const firebaseConfig = {
    apiKey: "AIzaSyB7jm6uXGCXFojcJ3kUZsirNCwRfprDBLk",
    authDomain: "ecommerce-a296a.firebaseapp.com",
    projectId: "ecommerce-a296a",
    storageBucket: "ecommerce-a296a.firebasestorage.app",
    messagingSenderId: "493789504342",
    appId: "1:493789504342:web:f4a7777bd50e118ad76cf7",
    measurementId: "G-29BPYDLX23",
    databaseURL: "https://ecommerce-a296a-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// --- 2. Authentication Functions (Signup/Login/Logout) ---

window.signup = function() {
    const semail = document.getElementById("semail")?.value;
    const spassword = document.getElementById("spassword")?.value;
     if(spassword.lenght<6){
    alert("password valid nahi ha")
   }
   else{
    console.log("valid password");
    
   }
    if (!semail || !spassword) return alert("Fields fill karein!");

    createUserWithEmailAndPassword(auth, semail, spassword)
        .then(() => { location.href = './nav.html'; })
        .catch((error) => alert(error.message));
};

window.login = function() {
    const lemail = document.getElementById("lemail")?.value;
    const lpassword = document.getElementById("lpassword")?.value;
   if(lpassword<5){
    alert("password valid nahi ha")
   }
   else{
    console.log("valid password");
    
   }
    if (!lemail || !lpassword) return alert("Email aur Password dalein!");

    signInWithEmailAndPassword(auth, lemail, lpassword)
        .then(() => { location.href = "./nav.html"; })
        .catch((error) => alert("Login Failed: " + error.message));
};

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        alert("are you sure you want to logut")
        signOut(auth).then(() => { location.href = "./index.html"; });
    });
}

// --- 3. Add Product Function (Updated with Redirect) ---

window.addProduct = function() {
    const pName = document.getElementById('pName').value;
    const pPrice = document.getElementById('pPrice').value;
    const pImg = document.getElementById('pImg').value;

    if (!pName || !pPrice || !pImg) {
        alert("Saari product details fill karein!");
        return;
    }

    const productsRef = ref(database, 'products');
    const newProductRef = push(productsRef); 

    set(newProductRef, {
        name: pName,
        price: pPrice,
        image: pImg,
        createdAt: new Date().toISOString()
    })
    .then(() => {
        alert("Product Successfully Added! ✅");
        // Form redirect to Home/Nav page
        location.href = './nav.html'; 
    })
    .catch((error) => alert("Error: " + error.message));
};

// --- 4. Delete Product Function ---

window.deleteProduct = function(productId) {
    if (confirm("Are you sure you want to delet this product ? 🗑️")) {
        const productRef = ref(database, `products/${productId}`);
        remove(productRef)
            .then(() => {
                alert("Product deleted!");
            })
            .catch((error) => {
                alert("Delete failed: " + error.message);
            });
    }
};

// --- 5. Display Products Realtime ---

const productContainer = document.getElementById('productContainer');

if (productContainer) {
    const productsRef = ref(database, 'products');
    
    onValue(productsRef, (snapshot) => {
        const data = snapshot.val();
        productContainer.innerHTML = ""; 

        if (data) {
            Object.keys(data).forEach((key) => {
                const product = data[key];
                
                const cardHTML = `
                    <div class="category-card">
                        <div class="card-image">
                            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/150'">
                        </div>
                        <h3>${product.name}</h3>
                        <p>Rs. ${Number(product.price).toLocaleString()}</p>
                        
                        <div class="card-actions">
                            <a href="#" class="category-link">Buy Now</a>
                            <button class="delete-btn" onclick="deleteProduct('${key}')">
                                Delete
                            </button>
                        </div>
                    </div>
                `;
                productContainer.innerHTML += cardHTML;
            });
        } else {
            productContainer.innerHTML = "<p class='no-products'>Abhi tak koi product nahi hai.</p>";
        }
    });
}

// --- 6. Event Listeners Setup ---
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("signupBtn")?.addEventListener("click", signup);
    document.getElementById("loginBtn")?.addEventListener("click", login);
    document.getElementById("saveProductBtn")?.addEventListener("click", addProduct);
});


// Button ko select karna naye ID ke zariye
const logoutButton = document.getElementById("userLogoutAction");

// Click event listener add karna
logoutButton.addEventListener("click", function() {
    // User ko second.html par bhej dena
    window.location.href = "second.html";
});