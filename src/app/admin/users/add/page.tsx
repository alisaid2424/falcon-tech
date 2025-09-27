import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";
import UserForm from "@/components/forms/UserForm";
import { Pages } from "@/constants/enums";

const AddUserPage = () => {
  return (
    <main>
      <section className="section-gap lg:w-3/4 mx-auto">
        <div className="container">
          <Link
            href={`${Pages.USERS}?pageNumber=1`}
            className="flex items-center gap-2 mb-20 bg-red-500 text-white text-base rounded-full w-fit py-2 px-3"
          >
            <ArrowLeftCircle size={24} /> Back to Users table
          </Link>

          <UserForm key="new user" />
        </div>
      </section>
    </main>
  );
};

export default AddUserPage;
