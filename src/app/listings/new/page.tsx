import ListingForm from "@/components/ListingForm";

export default function NewListingPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Create a listing</h1>
      <ListingForm mode="create" />
    </div>
  );
}
