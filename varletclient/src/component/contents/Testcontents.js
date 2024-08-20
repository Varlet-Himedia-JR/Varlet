import React from 'react';

function TestContents() {
    return (
        <div>
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 md:px-6 py-12">
                <div className="bg-background rounded-lg overflow-hidden shadow-lg transition-all hover:scale-105">
                    <img
                        src="/placeholder.svg"
                        alt="Product 1"
                        width="400"
                        height="300"
                        className="w-full h-60 object-cover"
                        style={{ aspectRatio: '400 / 300', objectFit: 'cover' }}
                    />
                    <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">Stylish Sunglasses</h3>
                        <p className="text-muted-foreground mb-4">Protect your eyes in style with our premium sunglasses.</p>
                        <div className="flex items-center justify-between">
                            <span className="text-primary font-semibold">$29.99</span>
                            <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-background rounded-lg overflow-hidden shadow-lg transition-all hover:scale-105">
                    <img
                        src="/placeholder.svg"
                        alt="Product 2"
                        width="400"
                        height="300"
                        className="w-full h-60 object-cover"
                        style={{ aspectRatio: '400 / 300', objectFit: 'cover' }}
                    />
                    <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">Leather Backpack</h3>
                        <p className="text-muted-foreground mb-4">Durable and stylish leather backpack for everyday use.</p>
                        <div className="flex items-center justify-between">
                            <span className="text-primary font-semibold">$59.99</span>
                            <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-background rounded-lg overflow-hidden shadow-lg transition-all hover:scale-105">
                    <img
                        src="/placeholder.svg"
                        alt="Product 3"
                        width="400"
                        height="300"
                        className="w-full h-60 object-cover"
                        style={{ aspectRatio: '400 / 300', objectFit: 'cover' }}
                    />
                    <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">Wireless Headphones</h3>
                        <p className="text-muted-foreground mb-4">Experience high-quality audio with our wireless headphones.</p>
                        <div className="flex items-center justify-between">
                            <span className="text-primary font-semibold">$79.99</span>
                            <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-background rounded-lg overflow-hidden shadow-lg transition-all hover:scale-105">
                    <img
                        src="/placeholder.svg"
                        alt="Product 4"
                        width="400"
                        height="300"
                        className="w-full h-60 object-cover"
                        style={{ aspectRatio: '400 / 300', objectFit: 'cover' }}
                    />
                    <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">Smart Watch</h3>
                        <p className="text-muted-foreground mb-4">Stay connected with our sleek and functional smartwatch.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default TestContents;
