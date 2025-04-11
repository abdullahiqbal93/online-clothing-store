import { assets } from "@/assets/assets";

export const registerFormControls = [
    {
      name: 'name',
      label: 'Enter Name',
      placeholder: 'Enter your name',
      componentType: 'input',
      type: 'text',
  
    },
    {
      name: 'email',
      label: 'Email',
      placeholder: 'Enter your email',
      componentType: 'input',
      type: 'email',
    },
    {
      name: 'password',
      label: 'Password',
      placeholder: 'Enter your password',
      componentType: 'input',
      type: 'password',
  
    }
  ]
  
  export const loginFormControls = [
    {
      name: 'email',
      label: 'Email',
      placeholder: 'Enter your email',
      componentType: 'input',
      type: 'email',
    },
    {
      name: 'password',
      label: 'Password',
      placeholder: 'Enter your password',
      componentType: 'input',
      type: 'password',
  
    }
  ]

  export const sortOptions = [
    { label: "Sort by: Relevant", value: "relevant" },
    { label: "Price: Low to High", value: "price-lowtohigh" },
    { label: "Price: High to Low", value: "price-hightolow" },
    { label: "Name: A to Z", value: "title-atoz" },
    { label: "Name: Z to A", value: "title-ztoa" }
  ];
  export const categoryList = ["men", "women", "kids", "accessories", "footwear"];

  export const categories = [
    { name: 'men', label: "Men", backgroundImage: assets.menCategory, description: "Stylish Menswear Collection" },
    { name: 'women', label: "Women", backgroundImage: assets.womenCategory, description: "Elegant Women's Styles" },
    { name: 'kids', label: "Kids", backgroundImage: assets.kidsCategory, description: "Playful Children's Wear" },
    { name: 'footwear', label: "Footwear", backgroundImage: assets.footwearsCategory, description: "Comfortable & Trendy Shoes" },
    { name: 'accessories', label: "Accessories", backgroundImage: assets.accessoriesCategory, description: "Unique Accessories & Extras" },
  ];
  

  


  


  