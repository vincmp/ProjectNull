"use client";
import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";

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

interface ViewContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactData?: Contact;
}

export default function ViewContactModal({
  isOpen,
  onClose,
  contactData,
}: ViewContactModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

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

  if (!isOpen || !contactData) return null;

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
          Visualizar Contato
        </h2>

        <div className="space-y-4 sm:space-y-5">
          {/* Linha 1: Nome e Telefone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <span className="text-sm font-medium text-gray-700">Nome</span>
              <p className="mt-1 p-3 w-full rounded-xl bg-gray-50 border border-gray-200">
                {contactData.name || "Não informado"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">
                Telefone
              </span>
              <p className="mt-1 p-3 w-full rounded-xl bg-gray-50 border border-gray-200">
                {contactData.phone || "Não informado"}
              </p>
            </div>
          </div>

          {/* Linha 2: Email e Empresa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <span className="text-sm font-medium text-gray-700">Email</span>
              <p className="mt-1 p-3 w-full rounded-xl bg-gray-50 border border-gray-200">
                {contactData.email || "Não informado"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Empresa</span>
              <p className="mt-1 p-3 w-full rounded-xl bg-gray-50 border border-gray-200">
                {contactData.company || "Não informado"}
              </p>
            </div>
          </div>

          {/* Linha 3: Tipo de Contato e CEP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <span className="text-sm font-medium text-gray-700">
                Tipo de Contato
              </span>
              <p className="mt-1 p-3 w-full rounded-xl bg-gray-50 border border-gray-200">
                {contactData.contactType
                  ? contactData.contactType.charAt(0).toUpperCase() +
                    contactData.contactType.slice(1)
                  : "Não informado"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">CEP</span>
              <p className="mt-1 p-3 w-full rounded-xl bg-gray-50 border border-gray-200">
                {contactData.cep || "Não informado"}
              </p>
            </div>
          </div>

          {/* Endereço */}
          <div className="border-t border-gray-200 pt-5 mt-5">
            <p className="text-sm font-medium text-gray-700 mb-1">Endereço</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <span className="text-xs font-medium text-gray-600">
                  Logradouro
                </span>
                <p className="mt-1 p-3 w-full rounded-xl bg-gray-50 border border-gray-200">
                  {contactData.logradouro || "Não informado"}
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600">
                  Número
                </span>
                <p className="mt-1 p-3 w-full rounded-xl bg-gray-50 border border-gray-200">
                  {contactData.numero || "Não informado"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-4 sm:mt-5">
              <div>
                <span className="text-xs font-medium text-gray-600">
                  Complemento
                </span>
                <p className="mt-1 p-3 w-full rounded-xl bg-gray-50 border border-gray-200">
                  {contactData.complemento || "Não informado"}
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600">
                  Bairro
                </span>
                <p className="mt-1 p-3 w-full rounded-xl bg-gray-50 border border-gray-200">
                  {contactData.bairro || "Não informado"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-4 sm:mt-5">
              <div>
                <span className="text-xs font-medium text-gray-600">
                  Cidade
                </span>
                <p className="mt-1 p-3 w-full rounded-xl bg-gray-50 border border-gray-200">
                  {contactData.localidade || "Não informado"}
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600">
                  Estado (UF)
                </span>
                <p className="mt-1 p-3 w-full rounded-xl bg-gray-50 border border-gray-200">
                  {contactData.uf || "Não informado"}
                </p>
              </div>
            </div>
          </div>

          {/* Status Ativo */}
          <div className="flex items-center pt-2">
            <span className="text-sm font-medium text-gray-700">
              Contato Ativo
            </span>
            <p
              className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                contactData.isActive
                  ? "bg-green-500/20 text-green-700"
                  : "bg-red-500/20 text-red-700"
              }`}
            >
              {contactData.isActive ? "Sim" : "Não"}
            </p>
          </div>

          {/* Observação */}
          <div className="pt-2">
            <span className="text-sm font-medium text-gray-700">
              Observação
            </span>
            <p className="mt-1 p-3 w-full rounded-xl bg-gray-50 border border-gray-200">
              {contactData.observation || "Não informado"}
            </p>
          </div>
        </div>

        <footer className="mt-6 sm:mt-8 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-gray-200/80 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-300/80 transition duration-200"
          >
            Fechar
          </button>
        </footer>
      </div>
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(modalContent, document.body);
  }
  return null;
}
