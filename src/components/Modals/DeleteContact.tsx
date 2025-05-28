"use client";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface DeleteContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactId: number;
  contactName: string | null;
  onDeleteSuccess?: () => void;
}

export default function DeleteContactModal({
  isOpen,
  onClose,
  contactId,
  contactName,
  onDeleteSuccess,
}: DeleteContactModalProps) {
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

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        if (onDeleteSuccess) onDeleteSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Erro ao excluir contato.");
      }
    } catch (error) {
      console.error("Erro ao excluir contato:", error);
      alert("Ocorreu um erro ao excluir o contato.");
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4 font-[Inter,system-ui,-apple-system,sans-serif]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
      >
        <h2
          id="modalTitle"
          className="text-xl font-bold text-gray-900 sm:text-2xl"
        >
          Excluir Contato
        </h2>
        <div className="mt-4">
          <p className="text-pretty text-gray-700">
            Tem certeza que deseja excluir o contato{" "}
            <span className="font-medium">{contactName || "este contato"}</span>
            ? Essa ação não pode ser desfeita.
          </p>
        </div>
        <footer className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Excluir
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
