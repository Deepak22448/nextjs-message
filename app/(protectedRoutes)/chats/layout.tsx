import FriendsList from "@/components/FriendsList";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="sm:flex mt-3 gap-x-2 w-full block">
      <FriendsList />
      {children}
    </section>
  );
}
