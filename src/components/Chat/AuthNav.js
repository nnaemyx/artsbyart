import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Novu from "./Novu";
import { logOut } from "@/utils/functions";
import { account } from "@/utils/appwrite";

const AuthNav = () => {
	const router = useRouter();
	const [user, setUser] = useState({});

	useEffect(() => {
		async function authStatus() {
			try {
				const user = await account.get();
				setUser(user);
			} catch (err) {}
		}
		authStatus();
	}, []);

	return (
		<nav className='w-full h-[10vh] md:px-8 px-4 py-2 border-b-[1px] border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10'>
			<Link href='/'>
				<h2 className='font-bold text-xl'>FirmSupport</h2>
			</Link>
			<div className='flex items-center space-x-5'>
				<p className='md-block hidden'>{user?.name || " "}</p>

				{user?.$id ? (
					<>
						<Novu />

						<button
							onClick={() => logOut(router)}
							className='bg-[#314484] text-gray-50 py-2 px-6 rounded hover:bg-red-500'
						>
							Sign out
						</button>
					</>
				) : (
					<Link
						href='/admin/staff/login'
						className='md:text-md bg-[#314484] text-gray-50 md:p-3 p-2 text-sm rounded'
					>
						Staff Sign in
					</Link>
				)}
			</div>
		</nav>
	);
};

export default AuthNav;