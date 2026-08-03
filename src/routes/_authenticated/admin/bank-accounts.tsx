import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/crud-page";

function BankAccountsPage() {
  return (
    <CrudPage
      title="Rekening Donasi"
      description="Kelola daftar rekening bank yang tampil di halaman donasi."
      table="bank_accounts"
      orderBy={{ column: "sort_order", ascending: true }}
      searchFields={["bank_name", "account_number", "account_holder"]}
      defaultValues={{ bank_name: "", account_number: "", account_holder: "", note: "", sort_order: 0, is_active: true }}
      fields={[
        { name: "bank_name", label: "Nama Bank", type: "text", required: true, placeholder: "BSI" },
        { name: "account_number", label: "Nomor Rekening", type: "text", required: true, placeholder: "1234567890" },
        { name: "account_holder", label: "Atas Nama", type: "text", required: true, placeholder: "Komunitas Berbagi Sehat Berbagi Berkah" },
        { name: "note", label: "Keterangan", type: "text", span: 2, placeholder: "Bank Syariah Indonesia" },
        { name: "sort_order", label: "Urutan", type: "number" },
        { name: "is_active", label: "Aktif", type: "boolean" },
      ]}
      columns={[
        { name: "bank_name", label: "Bank" },
        { name: "account_number", label: "Nomor Rekening" },
        { name: "account_holder", label: "Atas Nama" },
        { name: "sort_order", label: "Urutan" },
        { name: "is_active", label: "Aktif" },
      ]}
    />
  );
}

export const Route = createFileRoute("/_authenticated/admin/bank-accounts")({
  component: BankAccountsPage,
});
