import {
	FaFileInvoice,
	FaHome,
	FaShoppingCart,
	FaUserTie,
	FaUsers,
} from "react-icons/fa";
import { GrUnorderedList } from "react-icons/gr";
import { BsShop } from "react-icons/bs";
import { FaShopLock } from "react-icons/fa6";
import { GoListUnordered } from "react-icons/go";
import { GrMoney } from "react-icons/gr";
import { GiChart } from "react-icons/gi";
import { MdOutlineRealEstateAgent } from "react-icons/md";

import { VscSettingsGear } from "react-icons/vsc";

// Note: do not add href in the label object, it is rendering as label
export const menuItems = [
	{
		name: "Dashboard",
		href: "/",
		icon: <FaHome />,
	},
	{
		name: "Shops",
		href: "/shops",
		icon: <BsShop />,
	},
	{
		name: "Products",
		href: "/products",
		icon: <FaShoppingCart />,
	},
	{
		name: "Orders",
		href: "/orders",
		icon: <GrUnorderedList />,
	},
	{
		name: "Invoices",
		href: "/invoices",
		icon: <FaFileInvoice />,
	},
	// {
	// 	name: "ShopKeepers",
	// 	href: "/shopkeeper",
	// 	icon: <HiShoppingBag />,
	// },
	{
		name: "Transections",
		href: "/transections",
		icon: <GrMoney />,
	},

	{
		name: "Earnings",
		href: "/earnings",
		icon: <GiChart />,
	},
	{
		name: "Users",
		href: "/users",
		icon: <FaUsers />,
	},
	// {
	// 	name: "Analyses",
	// 	href: "/analyses",
	// 	icon: <SiGoogleanalytics />,
	// },
	{
		name: "Admins",
		href: "/admins",
		icon: <FaUserTie />,
	},
	{
		name: "Agents",
		href: "/agents",
		icon: <MdOutlineRealEstateAgent />,
	},

	{
		name: "Product pre-requisites",
		href: "/ageents",
		icon: <GoListUnordered />,
		dropdownItems: [
			{
				name: "Categories",
				href: "/product-pre-requisites/categories",
			},
			{
				name: "Brands",
				href: "/product-pre-requisites/brands",
			},
			{
				name: "Units",
				href: "/product-pre-requisites/units",
			},
			{
				name: "Tags",
				href: "/product-pre-requisites/tags",
			},
		],
	},
	{
		name: "Shop pre-requisites",
		href: "#",
		icon: <FaShopLock />,
		dropdownItems: [
			{
				name: "Shop Categories",
				href: "/shop-pre-requisites/categories",
			},
		],
	},

	{
		name: "Setting",
		href: "/settings",
		icon: <VscSettingsGear />,
	},
];
