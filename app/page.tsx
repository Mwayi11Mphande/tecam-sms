// // import { GalleryVerticalEnd } from "lucide-react"

// // import { LoginForm } from "@/components/login-form"
// // import Image from "next/image"

// // export default function LoginPage() {
// //   return (
// //     <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
// //       <div className="flex w-full max-w-sm flex-col gap-6">
// //         <a href="#" className="flex flex-col items-center gap-3 font-medium">
              
// //             </a>
// //         <LoginForm />
// //       </div>
// //     </div>
// //   )
// // }


// import { GalleryVerticalEnd } from "lucide-react"

// import { LoginForm } from "@/components/login-form"
// import Image from "next/image"

// export default function LoginPage() {
//   return (
//     <div className="grid min-h-svh lg:grid-cols-2">
//       <div className="flex flex-col gap-4 p-6 md:p-10">
//         <div className="flex justify-center gap-2 md:justify-start">
//           <a href="#" className="flex items-center gap-2 font-medium">
//             <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
        //       <Image
        //   src="/logo2.png"
        //   width={180}
        //   height={180}
        //   alt="site_logo"
        //   className="object-contain"
        //   priority
        // />
//         <span className="sr-only">SS</span>
//         </div>
//           </a>
//         </div>
//         <div className="flex flex-1 items-center justify-center">
//           <div className="w-full max-w-xs">
//             <LoginForm />
//           </div>
//         </div>
//       </div>
//       <div className="bg-muted relative hidden lg:block">
        
//       </div>
//     </div>
//   )
// }


import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}
