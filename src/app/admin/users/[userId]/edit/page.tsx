import UserForm from "@/components/forms/UserForm";
import { Pages } from "@/constants/enums";
import { getUser } from "@/server/db/users";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface EditUserPageProps {
  params: Promise<{ userId: string }>;
}

const EditUserPage = async ({ params }: EditUserPageProps) => {
  const { userId } = await params;
  const user = await getUser(userId);

  if (!user) notFound();

  return (
    <main>
      <section className="section-gap lg:w-3/4 mx-auto">
        <div className="container">
          <Link
            href={`${Pages.USERS}?pageNumber=1`}
            className="flex items-center gap-2 mb-20 bg-red-500 text-white text-base rounded-full w-fit py-2 px-3"
          >
            <ArrowLeftCircle size={24} /> Back to Users
          </Link>

          <UserForm key={user.id} user={user} />
        </div>
      </section>
    </main>
  );
};

export default EditUserPage;
