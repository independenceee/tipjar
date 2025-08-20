import Image from "next/image";
import Link from "next/link";
import { routers } from "~/constants/routers";
import { images } from "~/public/images";
export default function Home() {
  return (
    <main className="w-full min-h-screen bg-white overflow-auto">
      <div className="fixed inset-0 w-full h-full bg-top bg-cover bg-no-repeat z-0" />
      <div className="relative max-w-screen-2xl mx-auto min-h-screen">
        <div className="hidden md:block">
          {/* header */}
          <div className="absolute top-[74px] h-[82px] rounded-[75px] flex items-center z-10 bg-white  w-full border-b border-gray-200 dark:border-white/20  backdrop-blur-sm">
            <div className="absolute border-[5px] border-[rgba(79,55,139,0.05)] border-solid inset-[-5px] pointer-events-none rounded-[80px]" />
            <div className="flex flex-row items-center justify-between w-full h-full pl-6 pr-[11px] py-[9px]">
              <Link href={routers.home} className="flex items-center gap-4">
                <Image src={images.logo} alt="Logo" width={50} height={50} />
                <h2 className="bg-gradient-to-r from-[#4b7cf6] to-[#e34aa5] bg-clip-text text-transparent font-bold text-[35px]">Hydra Tipjar</h2>
              </Link>
              <div className="bg-gradient-to-r from-[#4b7cf6] to-[#9564cf] p-[2px] rounded-full w-fit">
                <Link
                  className="flex items-center justify-center w-fit h-[54px] bg-[#fcfafe] rounded-full px-6 text-[18px] font-bold text-[#4b7cf6] transition outline-none"
                  href={routers.login}
                >
                  Connect Wallet
                </Link>
              </div>
            </div>
          </div>
          {/*  */}
          <div className="absolute left-[130px] top-[240px] w-[682px] flex flex-col items-start z-10">
            <h1 className="font-bold text-[64px] leading-[64px] tracking-[-0.25px] text-[#121212] mb-6 font-['Circular_Std:Medium',_sans-serif]">
              Get <span className="bg-gradient-to-r from-[#4b7cf6] to-[#e34aa5] bg-clip-text text-transparent">tipped in crypto. </span>
              <span>Anywhere,Everywhere.</span>
            </h1>
            <div className="flex flex-col gap-2.5 w-[314px]">
              <div className="flex items-center bg-gradient-to-r from-[#ffffff00] to-[#ffffff80] rounded-bl-[8px] rounded-br-[100px] rounded-tl-[8px] rounded-tr-[100px] px-4 h-9 mb-1">
                {/* <Image src="/lovable-uploads/abdf0571-c0da-4233-90a5-34e8a61d2054.png" alt="check" className="w-[18px] h-[18px] mr-2.5" /> */}
                <span className="font-normal text-[24px] text-[#3d3b43]">Create your Tip Jar</span>
              </div>
              <div className="flex items-center bg-gradient-to-r from-[#ffffff00] to-[#ffffff80] rounded-bl-[8px] rounded-br-[100px] rounded-tl-[8px] rounded-tr-[100px] px-4 h-9 mb-1">
                {/* <Image src="/lovable-uploads/abdf0571-c0da-4233-90a5-34e8a61d2054.png" alt="check" className="w-[18px] h-[18px] mr-2.5" /> */}
                <span className="font-normal text-[24px] text-[#3d3b43]">Share your link</span>
              </div>
              <div className="flex items-center bg-gradient-to-r from-[#ffffff00] to-[#ffffff80] rounded-bl-[8px] rounded-br-[100px] rounded-tl-[8px] rounded-tr-[100px] px-4 h-9 mb-1">
                {/* <Image src="/lovable-uploads/abdf0571-c0da-4233-90a5-34e8a61d2054.png" alt="check" className="w-[18px] h-[18px] mr-2.5" /> */}
                <span className="font-normal text-[24px] text-[#3d3b43]">Receive crypto tips.</span>
              </div>
            </div>
            <button className="mt-6 bg-gradient-to-r from-[#4b7cf6] to-[#9564cf] rounded-full text-white font-bold text-[18px] px-6 h-[64px] flex items-center justify-center w-fit transition-shadow hover:shadow-lg">
              Start Earning Tips.
            </button>
          </div>
          {/*  */}
        </div>
      </div>
    </main>
  );
}
