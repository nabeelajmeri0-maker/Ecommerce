

// =====================================================
// FIREBASE IMPORTS
// =====================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

import {
    getDatabase,
    ref,
    onValue,
    push,
    set,
    remove
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";


// =====================================================
// FIREBASE CONFIGURATION
// =====================================================

const firebaseConfig = {
    apiKey: "AIzaSyB7jm6uXGCXFojcJ3kUZsirNCwRfprDBLk",
    authDomain: "ecommerce-a296a.firebaseapp.com",
    projectId: "ecommerce-a296a",
    storageBucket: "ecommerce-a296a.firebasestorage.app",
    messagingSenderId: "493789504342",
    appId: "1:493789504342:web:f4a7777bd50e118ad76cf7",
    measurementId: "G-29BPYDLX23",
    databaseURL:
        "https://ecommerce-a296a-default-rtdb.asia-southeast1.firebasedatabase.app/"
};


// =====================================================
// INITIALIZE FIREBASE
// =====================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const database = getDatabase(app);


// =====================================================
// AUTH STATE
// =====================================================

let currentUser = null;

let authReadyResolve;

const authReady = new Promise((resolve) => {
    authReadyResolve = resolve;
});


onAuthStateChanged(auth, (user) => {

    currentUser = user;

    if (user) {

        console.log("================================");
        console.log("USER LOGGED IN");
        console.log("Email:", user.email);
        console.log("UID:", user.uid);
        console.log("================================");

    } else {

        console.log("No user is currently logged in.");

    }

    // Firebase authentication state ready
    authReadyResolve(user);

});


// =====================================================
// SIGNUP
// =====================================================

window.signup = async function () {

    const emailInput =
        document.getElementById("semail");

    const passwordInput =
        document.getElementById("spassword");


    const semail =
        emailInput?.value.trim();

    const spassword =
        passwordInput?.value;


    // Empty fields
    if (!semail || !spassword) {

        alert("Email aur Password dalein!");

        return;
    }


    // Password validation
    if (spassword.length < 6) {

        alert(
            "Password kam az kam 6 characters ka hona chahiye!"
        );

        return;
    }


    try {

        await createUserWithEmailAndPassword(
            auth,
            semail,
            spassword
        );


        alert(
            "Account Successfully Created! ✅"
        );


        window.location.href =
            "./nav.html";


    } catch (error) {

        console.error(
            "Signup Error:",
            error
        );


        alert(
            "Signup Failed: " +
            error.message
        );

    }

};


// =====================================================
// LOGIN
// =====================================================

window.login = async function () {

    const emailInput =
        document.getElementById("lemail");

    const passwordInput =
        document.getElementById("lpassword");


    const lemail =
        emailInput?.value.trim();

    const lpassword =
        passwordInput?.value;


    // Empty fields
    if (!lemail || !lpassword) {

        alert(
            "Email aur Password dalein!"
        );

        return;
    }


    // Password validation
    if (lpassword.length < 6) {

        alert(
            "Password kam az kam 6 characters ka hona chahiye!"
        );

        return;
    }


    try {

        await signInWithEmailAndPassword(
            auth,
            lemail,
            lpassword
        );


        alert(
            "Login Successful! ✅"
        );


        window.location.href =
            "./nav.html";


    } catch (error) {

        console.error(
            "Login Error:",
            error
        );


        alert(
            "Login Failed: " +
            error.message
        );

    }

};


// =====================================================
// LOGOUT
// =====================================================

function setupLogout() {

    const logoutBtn =
        document.getElementById("logoutBtn");


    if (!logoutBtn) {
        return;
    }


    logoutBtn.addEventListener(
        "click",
        async () => {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {
                return;
            }


            try {

                await signOut(auth);


                alert(
                    "Logout Successful! 👋"
                );


                window.location.href =
                    "./index.html";


            } catch (error) {

                console.error(
                    "Logout Error:",
                    error
                );


                alert(
                    "Logout Failed: " +
                    error.message
                );

            }

        }
    );

}


// =====================================================
// ADD PRODUCT
// =====================================================

window.addProduct = async function () {

    // Wait until Firebase knows authentication state
    const user = await authReady;


    // User is NOT logged in
    if (!user) {

        alert(
            "Product add karne ke liye pehle login karein."
        );


        window.location.href =
            "./index.html";


        return;
    }


    console.log(
        "Adding product for:",
        user.email
    );


    const nameInput =
        document.getElementById("pName");

    const priceInput =
        document.getElementById("pPrice");

    const imageInput =
        document.getElementById("pImg");


    const pName =
        nameInput?.value.trim();

    const pPrice =
        priceInput?.value.trim();

    const pImg =
        imageInput?.value.trim();


    // Validate fields
    if (!pName || !pPrice || !pImg) {

        alert(
            "Saari product details fill karein!"
        );

        return;
    }


    // Convert price to number
    const price =
        Number(pPrice);


    // Validate price
    if (
        Number.isNaN(price) ||
        price < 0
    ) {

        alert(
            "Please valid price enter karein."
        );

        return;
    }


    try {

        console.log(
            "Saving product to Firebase..."
        );


        // Products reference
        const productsRef =
            ref(
                database,
                "products"
            );


        // Generate Firebase ID
        const newProductRef =
            push(productsRef);


        // Product data
        const productData = {

            name: pName,

            price: price,

            image: pImg,

            createdAt:
                new Date().toISOString()

        };


        // Save product
        await set(
            newProductRef,
            productData
        );


        console.log(
            "Product successfully saved:",
            productData
        );


        alert(
            "Product Successfully Added! ✅"
        );


        // Redirect
        window.location.href =
            "./nav.html";


    } catch (error) {

        console.error(
            "Firebase Add Product Error:",
            error
        );


        alert(
            "Product add nahi hua:\n\n" +
            error.code +
            "\n\n" +
            error.message
        );

    }

};


// =====================================================
// DELETE PRODUCT
// =====================================================

window.deleteProduct = async function (
    productId
) {

    // Wait for auth state
    const user = await authReady;


    // Login required
    if (!user) {

        alert(
            "Delete karne ke liye login karein."
        );

        return;
    }


    if (!productId) {

        alert(
            "Product ID nahi mili."
        );

        return;
    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const productRef =
            ref(
                database,
                `products/${productId}`
            );


        await remove(productRef);


        alert(
            "Product deleted successfully! 🗑️"
        );


    } catch (error) {

        console.error(
            "Delete Product Error:",
            error
        );


        alert(
            "Delete failed:\n\n" +
            error.code +
            "\n\n" +
            error.message
        );

    }

};


// =====================================================
// LOAD PRODUCTS
// =====================================================

function loadProducts() {

    const productContainer =
        document.getElementById(
            "productContainer"
        );


    // Page doesn't contain products section
    if (!productContainer) {
        return;
    }


    console.log(
        "Loading products from Firebase..."
    );


    const productsRef =
        ref(
            database,
            "products"
        );


    onValue(

        productsRef,

        (snapshot) => {

            const data =
                snapshot.val();


            // Clear container
            productContainer.innerHTML =
                "";


            // No products
            if (!data) {

                productContainer.innerHTML = `
                    <p class="no-products">
                        Abhi tak koi product nahi hai.
                    </p>
                `;


                console.log(
                    "No products found in Firebase."
                );


                return;
            }


            console.log(
                "Products received:",
                data
            );


            // Loop products
            Object.entries(data).forEach(
                ([key, product]) => {


                    const productName =
                        product.name ||
                        "Unnamed Product";


                    const productPrice =
                        Number(
                            product.price || 0
                        );


                    const productImage =
                        product.image ||
                        "https://via.placeholder.com/300x300?text=No+Image";


                    const cardHTML = `

                        <div class="category-card">

                            <div class="card-image">

                                <img
                                    src="${productImage}"
                                    alt="${productName}"
                                    onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'"
                                >

                            </div>


                            <h3>
                                ${productName}
                            </h3>


                            <p>
                                Rs.
                                ${productPrice.toLocaleString()}
                            </p>


                            <div class="card-actions">

                                <a
                                    href="#"
                                    class="category-link"
                                >
                                    Buy Now
                                </a>


                                <button
                                    class="delete-btn"
                                    onclick="deleteProduct('${key}')"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    `;


                    productContainer.insertAdjacentHTML(
                        "beforeend",
                        cardHTML
                    );

                }
            );

        },


        (error) => {

            console.error(
                "Firebase Products Error:",
                error
            );


            productContainer.innerHTML = `
                <p class="no-products">
                    Products load nahi ho rahe.
                    <br><br>
                    ${error.message}
                </p>
            `;

        }

    );

}


// =====================================================
// USER LOGOUT ACTION
// =====================================================

function setupUserLogoutAction() {

    const logoutButton =
        document.getElementById(
            "userLogoutAction"
        );


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "second.html";

        }
    );

}


// =====================================================
// DOM CONTENT LOADED
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {


        // =============================================
        // SIGNUP BUTTON
        // =============================================

        const signupBtn =
            document.getElementById(
                "signupBtn"
            );


        if (signupBtn) {

            signupBtn.addEventListener(
                "click",
                window.signup
            );

        }


        // =============================================
        // LOGIN BUTTON
        // =============================================

        const loginBtn =
            document.getElementById(
                "loginBtn"
            );


        if (loginBtn) {

            loginBtn.addEventListener(
                "click",
                window.login
            );

        }


        // =============================================
        // SAVE PRODUCT BUTTON
        // =============================================

        const saveProductBtn =
            document.getElementById(
                "saveProductBtn"
            );


        if (saveProductBtn) {

            saveProductBtn.addEventListener(
                "click",
                window.addProduct
            );

        }


        // =============================================
        // LOGOUT
        // =============================================

        setupLogout();


        // =============================================
        // USER LOGOUT ACTION
        // =============================================

        setupUserLogoutAction();


        // =============================================
        // LOAD PRODUCTS
        // =============================================

        loadProducts();

    }
);