// /**
//  * v0 by Vercel.
//  * @see https://v0.dev/t/W4nWGFtZcG7
//  * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
//  */
// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"

// export default function Testcontents() {
//   const [isForSale, setIsForSale] = useState(true)
//   const properties = [
//     {
//       id: 1,
//       image: "/placeholder.svg",
//       name: "Single-Family Home",
//       description: "Spacious 4-bedroom, 3-bathroom home with a large backyard.",
//       bedrooms: 4,
//       bathrooms: 3,
//       sqft: 2500,
//     },
//     {
//       id: 2,
//       image: "/placeholder.svg",
//       name: "Luxury Condo",
//       description: "Stunning 2-bedroom, 2-bathroom condo with panoramic views.",
//       bedrooms: 2,
//       bathrooms: 2,
//       sqft: 1800,
//     },
//     {
//       id: 3,
//       image: "/placeholder.svg",
//       name: "Townhouse",
//       description: "3-bedroom, 2.5-bathroom townhouse with a private patio.",
//       bedrooms: 3,
//       bathrooms: 2.5,
//       sqft: 1900,
//     },
//     {
//       id: 4,
//       image: "/placeholder.svg",
//       name: "Multi-Family Home",
//       description: "2-unit property with a 2-bedroom and a 1-bedroom unit.",
//       bedrooms: 3,
//       bathrooms: 3,
//       sqft: 2800,
//     },
//     {
//       id: 5,
//       image: "/placeholder.svg",
//       name: "Vacant Land",
//       description: "Buildable lot with stunning mountain views.",
//       bedrooms: 0,
//       bathrooms: 0,
//       sqft: 10000,
//     },
//   ]
//   return (
//     <section className="w-full py-12 md:py-24 lg:py-32">
//       <div className="container px-4 md:px-6">
//         <div className="flex items-center justify-between mb-8">
//           <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
//             {isForSale ? "Properties for Sale" : "Properties for Rent"}
//           </h1>
//           <Button variant={isForSale ? "secondary" : "primary"} onClick={() => setIsForSale(!isForSale)}>
//             {isForSale ? "View Rentals" : "View Sales"}
//           </Button>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {properties.map((property) => (
//             <div
//               key={property.id}
//               className="relative overflow-hidden rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
//             >
//               <img
//                 src="/placeholder.svg"
//                 alt={property.name}
//                 width={450}
//                 height={300}
//                 className="object-cover w-full h-64 group-hover:opacity-50"
//                 style={{ aspectRatio: "450/300", objectFit: "cover" }}
//               />
//               <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 bg-gradient-to-t from-black/75 to-transparent group-hover:opacity-0 transition-opacity duration-300">
//                 <h3 className="text-xl font-bold text-white">{property.name}</h3>
//                 <p className="text-sm text-white">{property.description}</p>
//               </div>
//               <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 bg-background opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                 <div className="grid gap-2">
//                   <div className="flex items-center gap-2 text-muted-foreground">
//                     <BedIcon className="w-5 h-5" />
//                     <span>{property.bedrooms} Bedrooms</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-muted-foreground">
//                     <BathIcon className="w-5 h-5" />
//                     <span>{property.bathrooms} Bathrooms</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-muted-foreground">
//                     <RulerIcon className="w-5 h-5" />
//                     <span>{property.sqft} sq ft</span>
//                   </div>
//                 </div>
//                 <Button className="mt-4">Book Now</Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// function BathIcon(props) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
//       <line x1="10" x2="8" y1="5" y2="7" />
//       <line x1="2" x2="22" y1="12" y2="12" />
//       <line x1="7" x2="7" y1="19" y2="21" />
//       <line x1="17" x2="17" y1="19" y2="21" />
//     </svg>
//   )
// }


// function BedIcon(props) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M2 4v16" />
//       <path d="M2 8h18a2 2 0 0 1 2 2v10" />
//       <path d="M2 17h20" />
//       <path d="M6 8v9" />
//     </svg>
//   )
// }


// function RulerIcon(props) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
//       <path d="m14.5 12.5 2-2" />
//       <path d="m11.5 9.5 2-2" />
//       <path d="m8.5 6.5 2-2" />
//       <path d="m17.5 15.5 2-2" />
//     </svg>
//   )
// }