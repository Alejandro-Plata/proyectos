export const Background = () => {
    return (
        <>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-20%] w-[300px] h-[300px] bg-teal-900/30 blur-[80px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-20%] w-[300px] h-[300px] bg-indigo-900/20 blur-[80px] rounded-full mix-blend-screen" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
            </div>
            <div className="absolute select-none z-0 flex items-center justify-center w-full h-full pointer-events-none opacity-10">
                <span className="text-[12rem] font-black text-white/5 tracking-tighter rotate-90 sm:rotate-0">
                    404
                </span>
            </div>
        </>
    );
};
