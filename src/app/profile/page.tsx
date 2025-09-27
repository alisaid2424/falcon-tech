import UserForm from "@/components/forms/UserForm";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) notFound();

  return (
    <main>
      <section className="section-gap lg:w-3/4 mx-auto">
        <div className="container">
          <UserForm key={session?.user.id} user={session?.user} />
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;
