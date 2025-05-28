"use client";
import { useState, useEffect } from "react";
import NewContactModal from "@/components/Modals/NewContact";
import EditContactModal from "@/components/Modals/EditContact";
import DeleteContactModal from "@/components/Modals/DeleteContact";
import ViewContactModal from "@/components/Modals/ViewContact";

interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
  company: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  observation: string;
  isActive: boolean;
  contactType: string;
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactToDelete, setContactToDelete] = useState<{
    id: number;
    name: string | null;
  } | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"true" | "false" | "all">(
    "true"
  );

  const fetchContacts = async () => {
    try {
      const response = await fetch(`/api/contacts?active=${activeFilter}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar contatos");
      }
      const data = await response.json();
      setContacts(data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar contatos:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();

    const interval = setInterval(() => {
      fetchContacts();
    }, 10000);

    return () => clearInterval(interval);
  }, [activeFilter]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    fetchContacts();
  };

  const openEditModal = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedContact(null);
    fetchContacts();
  };

  const openDeleteModal = (contact: Contact) => {
    setContactToDelete({ id: contact.id, name: contact.name });
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setContactToDelete(null);
    fetchContacts();
  };

  const openViewModal = (contact: Contact) => {
    setSelectedContact(contact);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedContact(null);
  };

  const handleDeleteSuccess = () => {
    setContacts((prev) =>
      prev.filter((contact) => contact.id !== contactToDelete?.id)
    );
    fetchContacts();
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveFilter(e.target.value as "true" | "false" | "all");
    setLoading(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-[Inter,system-ui,-apple-system,sans-serif] p-6">
      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Contatos</h2>
          <div className="flex space-x-3">
            <button
              onClick={openModal}
              className="bg-blue-500 text-white px-4 py-2 rounded-xl shadow-sm hover:bg-blue-600 transition duration-200"
            >
              Novo Contato
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <div className="mt-4 sm:mt-0">
            <label
              htmlFor="activeFilter"
              className="mr-2 text-sm font-medium text-gray-700"
            >
              Filtrar por status:
            </label>
            <select
              id="activeFilter"
              value={activeFilter}
              onChange={handleFilterChange}
              className="p-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition duration-200"
            >
              <option value="true">Ativos</option>
              <option value="false">Inativos</option>
              <option value="all">Todos</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl bg-white/80 shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100/50 text-gray-700">
                <th className="p-4 text-center font-medium text-sm">ID</th>
                <th className="p-4 text-center font-medium text-sm">Nome</th>
                <th className="p-4 text-center font-medium text-sm">
                  Telefone
                </th>
                <th className="p-4 text-center font-medium text-sm">Email</th>
                <th className="p-4 text-center font-medium text-sm">
                  Observação
                </th>
                <th className="p-4 text-center font-medium text-sm">Ativo</th>
                <th className="p-4 text-center font-medium text-sm">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    Carregando...
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    Nenhum contato encontrado
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="hover:bg-gray-50/50 transition duration-200"
                  >
                    <td className="p-4 border-t border-gray-100 text-center">
                      {contact.id}
                    </td>
                    <td className="p-4 border-t border-gray-100 text-center">
                      {contact.name}
                    </td>
                    <td className="p-4 border-t border-gray-100 text-center">
                      {contact.phone}
                    </td>
                    <td className="p-4 border-t border-gray-100 text-center">
                      {contact.email}
                    </td>
                    <td className="p-4 border-t border-gray-100 text-center">
                      {contact.observation}
                    </td>
                    <td className="p-4 border-t border-gray-100 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          contact.isActive
                            ? "bg-green-500/20 text-green-700"
                            : "bg-red-500/20 text-red-700"
                        }`}
                      >
                        {contact.isActive ? "Sim" : "Não"}
                      </span>
                    </td>
                    <td className="p-4 border-t border-gray-100 flex items-center justify-center space-x-2">
                      <button
                        onClick={() => openViewModal(contact)}
                        className="bg-blue-500/20 text-blue-700 px-3 py-1 rounded-xl hover:bg-blue-500/30 transition duration-200"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => openEditModal(contact)}
                        className="bg-orange-500/20 text-orange-700 px-3 py-1 rounded-xl hover:bg-orange-500/30 transition duration-200"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => openDeleteModal(contact)}
                        className="bg-red-500/20 text-red-700 px-3 py-1 rounded-xl hover:bg-red-500/30 transition duration-200"
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <NewContactModal isOpen={isModalOpen} onClose={closeModal} />
        <EditContactModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          initialData={selectedContact || undefined}
        />
        <DeleteContactModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          contactId={contactToDelete?.id || 0}
          contactName={contactToDelete?.name || null}
          onDeleteSuccess={handleDeleteSuccess}
        />
        <ViewContactModal
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
          contactData={selectedContact || undefined}
        />
      </div>
    </div>
  );
}
