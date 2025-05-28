"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import ContactTypeaheadInput from "@/components/Modals/ContactTypeaheadInput";

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

interface NewContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewContactModal({
  isOpen,
  onClose,
}: NewContactModalProps) {
  const [formData, setFormData] = useState<Contact>({
    id: 0,
    name: "",
    phone: "",
    email: "",
    company: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    localidade: "",
    uf: "",
    observation: "",
    isActive: true,
    contactType: "",
  });
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        id: 0,
        name: "",
        phone: "",
        email: "",
        company: "",
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        localidade: "",
        uf: "",
        observation: "",
        isActive: true,
        contactType: "",
      });
      setIsCepLoading(false);
      setCepError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (id === "cep") {
      const numericCep = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, cep: numericCep }));

      if (numericCep.length === 8) {
        fetchAddressFromCep(numericCep);
      } else {
        setCepError(null);
        if (numericCep.length < 8) {
          setFormData((prev) => ({
            ...prev,
            logradouro: "",
            bairro: "",
            localidade: "",
            uf: "",
          }));
        }
      }
    }
  };

  const handleContactTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, contactType: value }));
  };

  async function fetchAddressFromCep(cepToFetch: string) {
    setIsCepLoading(true);
    setCepError(null);
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepToFetch}/json/`
      );
      if (!response.ok) {
        throw new Error("Falha ao buscar CEP. Verifique a conexão.");
      }
      const data = await response.json();
      if (data.erro) {
        setCepError("CEP não encontrado ou inválido.");
        setFormData((prev) => ({
          ...prev,
          logradouro: "",
          bairro: "",
          localidade: "",
          uf: "",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          logradouro: data.logradouro || "",
          bairro: data.bairro || "",
          localidade: data.localidade || "",
          uf: data.uf || "",
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao buscar o CEP.";
      setCepError(errorMessage);
      setFormData((prev) => ({
        ...prev,
        logradouro: "",
        bairro: "",
        localidade: "",
        uf: "",
      }));
    } finally {
      setIsCepLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.phone ||
      !formData.email ||
      !formData.contactType
    ) {
      alert("Por favor, preencha todos os campos obrigatórios (*).");
      return;
    }

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onClose();
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Erro ao salvar contato.");
      }
    } catch (error) {
      console.error("Erro ao salvar contato:", error);
      alert("Ocorreu um erro ao salvar o contato.");
    }
  };

  if (!isOpen) return null;

  const contactTypeOptions = [
    { value: "cliente", label: "Cliente" },
    { value: "fornecedor", label: "Fornecedor" },
    { value: "parceiro", label: "Parceiro" },
  ];

  const modalContent = (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-black/40 p-4 sm:p-6 overflow-hidden">
      <div
        ref={modalRef}
        className="w-full max-w-[90vw] sm:max-w-2xl max-h-[calc(100vh-4rem)] rounded-2xl bg-white p-6 sm:p-8 overflow-y-auto transform transition-all duration-300 scale-100 font-[Inter,system-ui,-apple-system,sans-serif]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
      >
        <h2
          id="modalTitle"
          className="text-xl font-semibold text-gray-900 mb-6"
        >
          Novo Contato
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 sm:space-y-5">
            {/* Linha 1: Nome e Telefone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <label htmlFor="name" className="block">
                <span className="text-sm font-medium text-gray-700">
                  Nome <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 p-3 w-full rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition duration-200"
                  placeholder="Digite o nome"
                  required
                />
              </label>
              <label htmlFor="phone" className="block">
                <span className="text-sm font-medium text-gray-700">
                  Telefone <span className="text-red-500">*</span>
                </span>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 p-3 w-full rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition duration-200"
                  placeholder="(XX) XXXXX-XXXX"
                  required
                />
              </label>
            </div>

            {/* Linha 2: Email e Empresa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <label htmlFor="email" className="block">
                <span className="text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </span>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 p-3 w-full rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition duration-200"
                  placeholder="exemplo@dominio.com"
                  required
                />
              </label>
              <label htmlFor="company" className="block">
                <span className="text-sm font-medium text-gray-700">
                  Empresa
                </span>
                <input
                  type="text"
                  id="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="mt-1 p-3 w-full rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition duration-200"
                  placeholder="Nome da empresa"
                />
              </label>
            </div>

            {/* Linha 3: Tipo de Contato e CEP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 items-end">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Tipo de Contato <span className="text-red-500">*</span>
                </span>
                <ContactTypeaheadInput
                  options={contactTypeOptions}
                  value={formData.contactType}
                  onChange={handleContactTypeChange}
                  id="contactType"
                />
              </div>
              <label htmlFor="cep" className="block">
                <span className="text-sm font-medium text-gray-700">CEP</span>
                <input
                  type="text"
                  id="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  className="mt-1 p-3 w-full rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition duration-200"
                  placeholder="Digite o CEP (só números)"
                  maxLength={8}
                />
              </label>
            </div>

            {/* Feedback CEP */}
            {(isCepLoading || cepError) && (
              <div className="mt-1 sm:col-start-2">
                {isCepLoading && (
                  <p className="text-sm text-blue-600">Buscando CEP...</p>
                )}
                {cepError && <p className="text-sm text-red-600">{cepError}</p>}
              </div>
            )}

            {/* Endereço */}
            <div className="border-t border-gray-200 pt-5 mt-5">
              <p className="text-sm font-medium text-gray-700 mb-1">Endereço</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <label htmlFor="logradouro" className="block">
                  <span className="text-xs font-medium text-gray-600">
                    Logradouro
                  </span>
                  <input
                    type="text"
                    id="logradouro"
                    value={formData.logradouro}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition duration-200"
                    placeholder="Rua, Avenida..."
                  />
                </label>
                <label htmlFor="numero" className="block">
                  <span className="text-xs font-medium text-gray-600">
                    Número
                  </span>
                  <input
                    type="text"
                    id="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition duration-200"
                    placeholder="Ex: 123"
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-4 sm:mt-5">
                <label htmlFor="complemento" className="block">
                  <span className="text-xs font-medium text-gray-600">
                    Complemento
                  </span>
                  <input
                    type="text"
                    id="complemento"
                    value={formData.complemento}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition duration-200"
                    placeholder="Apto, Bloco, Casa..."
                  />
                </label>
                <label htmlFor="bairro" className="block">
                  <span className="text-xs font-medium text-gray-600">
                    Bairro
                  </span>
                  <input
                    type="text"
                    id="bairro"
                    value={formData.bairro}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition duration-200"
                    placeholder="Seu bairro"
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-4 sm:mt-5">
                <label htmlFor="localidade" className="block">
                  <span className="text-xs font-medium text-gray-600">
                    Cidade
                  </span>
                  <input
                    type="text"
                    id="localidade"
                    value={formData.localidade}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition duration-200"
                    placeholder="Sua cidade"
                  />
                </label>
                <label htmlFor="uf" className="block">
                  <span className="text-xs font-medium text-gray-600">
                    Estado (UF)
                  </span>
                  <input
                    type="text"
                    id="uf"
                    value={formData.uf}
                    onChange={handleChange}
                    className="mt-1 p-3 w-full rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition duration-200"
                    placeholder="UF"
                    maxLength={2}
                  />
                </label>
              </div>
            </div>

            <label htmlFor="observation" className="block pt-2">
              <span className="text-sm font-medium text-gray-700">
                Observação
              </span>
              <textarea
                id="observation"
                value={formData.observation}
                onChange={handleChange}
                className="mt-1 p-3 w-full rounded-xl bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition duration-200 resize-y"
                placeholder="Digite uma observação"
                rows={3}
              />
            </label>
          </div>

          <footer className="mt-6 sm:mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-gray-200/80 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-300/80 transition duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-600 transition duration-200"
            >
              Salvar
            </button>
          </footer>
        </form>
      </div>
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(modalContent, document.body);
  }
  return null;
}
