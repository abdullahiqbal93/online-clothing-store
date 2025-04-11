import { Product } from "@/api/product/schema/model";

export const searchProducts = async (req, res) => {
    try {
        const { keyword } = req.params;
        if (!keyword || typeof keyword !== 'string') {
            return res.status(400).json({ success: false, message: 'Keyword is required and must be in string format' });
        }


        const searchResults = await Product.aggregate([
            {
                $search: {
                    index: 'default',
                    text: {
                        query: keyword,
                        path: ['name', 'category', 'brand'],
                        fuzzy: { maxEdits: 1 } 
                    }
                }
            },
            {
                $project: {
                    name: 1,
                    images: 1,
                    category: 1,
                    brand: 1,
                    price:1
                }
            }
        ]);

        res.status(200).json({ success: true, data: searchResults });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};







