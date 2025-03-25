import { useState, useEffect } from "react";

const useFetchReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Dummy data for 20 reviews with random and varied text
        const dummyReviews = Array.from({ length: 20 }, (_, index) => ({
            text: `Review ${index + 1}: ${getRandomReviewText()}`,
            author: `Customer ${index + 1}`,
        }));

        // Simulating a delay like an API call
        setTimeout(() => {
            setReviews(dummyReviews);
            setLoading(false);
        }, 1000); // 1 second delay to simulate loading
    }, []);

    const getRandomReviewText = () => {
        const reviewTexts = [
            "I absolutely love this product! It exceeded my expectations in every way.",
            "It works well, but the quality could be improved. Overall, I am satisfied.",
            "Not as good as I thought it would be. The performance is decent, though.",
            "This is amazing! It has changed the way I do things. Highly recommend it.",
            "I had high hopes, but it just didn’t live up to the hype. Needs some improvements.",
            "Great value for money. Would definitely purchase again.",
            "It's okay, but I was expecting more from it. Might consider returning.",
            "I love how easy it is to use. Simple but effective!",
            "Fantastic product! It works exactly as advertised.",
            "The design is sleek and modern. I’m really impressed.",
            "It broke after a few uses. Very disappointed with the durability.",
            "This product is a game-changer! I will be buying more.",
            "The customer service was excellent when I had an issue. Five stars for support!",
            "I’m not sure if it’s worth the price. It performs well but feels a bit cheap.",
            "This is by far one of the best purchases I’ve made in a while.",
            "It’s a bit complicated to set up, but once you get the hang of it, it’s great.",
            "I wouldn’t recommend this to my friends. It didn’t live up to the promises.",
            "After using it for a few weeks, I’m really happy with my purchase.",
            "It's a decent product for the price. Nothing too fancy, but gets the job done.",
            "Absolutely worth the investment. I use it every day and haven’t had any issues.",
        ];

        // Randomly pick one of the review texts
        return reviewTexts[Math.floor(Math.random() * reviewTexts.length)];
    };

    return { reviews, loading, error };
};

export default useFetchReviews;
