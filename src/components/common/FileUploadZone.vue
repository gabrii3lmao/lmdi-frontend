<script lang="ts">
export interface UploadItem {
  id: string;
  file: File;
  studentName: string;
  previewUrl: string | null;
}
</script>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import { useToast } from "primevue/usetoast";

const props = withDefaults(
  defineProps<{
    modelValue: UploadItem[];
    accept?: string;
  }>(),
  { accept: "image/*,application/pdf" },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: UploadItem[]): void;
}>();

const toast = useToast();

const fileInput = ref<HTMLInputElement | null>(null);
const cameraInput = ref<HTMLInputElement | null>(null);
const isDragOver = ref(false);

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "application/pdf",
];

function isValidFile(file: File): boolean {
  if (file.type === "application/pdf") return true;
  if (file.type.startsWith("image/")) return true;
  return allowedTypes.includes(file.type);
}

function extractName(fileName: string): string {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

let idCounter = 0;
function generateId(): string {
  return `upload-${++idCounter}-${Date.now()}`;
}

function createUploadItem(file: File): UploadItem {
  return {
    id: generateId(),
    file,
    studentName: extractName(file.name),
    previewUrl: file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : null,
  };
}

function addFiles(newFiles: File[]) {
  const valid: UploadItem[] = [];
  for (const file of newFiles) {
    if (!isValidFile(file)) {
      toast.add({
        severity: "error",
        summary: "Formato inválido",
        detail: `"${file.name}" não é uma imagem ou PDF.`,
        life: 4000,
      });
      continue;
    }
    valid.push(createUploadItem(file));
  }
  if (valid.length > 0) {
    emit("update:modelValue", [...props.modelValue, ...valid]);
  }
}

function removeItem(id: string) {
  const item = props.modelValue.find((i) => i.id === id);
  if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
  emit(
    "update:modelValue",
    props.modelValue.filter((i) => i.id !== id),
  );
}

function onDrop(event: DragEvent) {
  event.preventDefault();
  isDragOver.value = false;

  const dataTransfer = event.dataTransfer;
  if (!dataTransfer) return;

  const files: File[] = [];

  if (dataTransfer.items) {
    for (let i = 0; i < dataTransfer.items.length; i++) {
      const entry = dataTransfer.items[i];
      if (entry && entry.kind === "file") {
        const file = entry.getAsFile();
        if (file) files.push(file);
      }
    }
  } else if (dataTransfer.files) {
    for (let i = 0; i < dataTransfer.files.length; i++) {
      const file = dataTransfer.files[i];
      if (file) files.push(file);
    }
  }

  if (files.length > 0) addFiles(files);
}

function onDragOver(event: DragEvent) {
  event.preventDefault();
  isDragOver.value = true;
}

function onDragLeave(event: DragEvent) {
  event.preventDefault();
  isDragOver.value = false;
}

function onFileInputChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    addFiles(Array.from(files));
  }
  target.value = "";
}

function onCameraCapture(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) addFiles([file]);
  target.value = "";
}

function triggerCamera() {
  cameraInput.value?.click();
}

onUnmounted(() => {
  for (const item of props.modelValue) {
    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
  }
});
</script>

<template>
  <div class="space-y-4">
    <!-- Hidden inputs -->
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      multiple
      class="hidden"
      @change="onFileInputChange"
    />
    <input
      ref="cameraInput"
      type="file"
      accept="image/*"
      capture="environment"
      class="hidden"
      @change="onCameraCapture"
    />

    <!-- Drop zone -->
    <div
      @click="fileInput?.click()"
      @drop="onDrop"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      :class="[
        'relative border-2 border-dashed rounded-2xl p-6 sm:p-8 transition-all duration-200 text-center overflow-hidden cursor-pointer',
        isDragOver
          ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]'
          : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400 hover:bg-emerald-500/5 bg-slate-50/50 dark:bg-slate-800/50',
      ]"
    >
      <div class="py-4">
        <div
          :class="[
            'w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 transition-all duration-200',
            isDragOver
              ? 'bg-emerald-100 scale-110'
              : 'bg-slate-100 dark:bg-slate-700',
          ]"
        >
          <i
            :class="[
              'pi pi-cloud-upload text-2xl transition-colors duration-200',
              isDragOver ? 'text-emerald-600' : 'text-slate-400 dark:text-slate-500',
            ]"
          />
        </div>
        <p class="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">
          Arraste os arquivos aqui ou clique para selecionar
        </p>
        <p class="text-xs text-slate-400 dark:text-slate-500 font-medium">
          Imagens (JPG, PNG, WEBP) ou PDF &mdash; múltiplos arquivos
        </p>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="flex items-center justify-center gap-3">
      <button
        type="button"
        @click="fileInput?.click()"
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-colors"
      >
        <i class="pi pi-folder-open text-sm" />
        Escolher arquivos
      </button>
      <button
        type="button"
        @click="triggerCamera"
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold transition-colors"
      >
        <i class="pi pi-camera text-sm" />
        Usar câmera
      </button>
    </div>

    <!-- File list -->
    <div v-if="modelValue.length > 0" class="space-y-2 pt-2">
      <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
        {{ modelValue.length }} arquivo{{ modelValue.length !== 1 ? "s" : "" }} selecionado{{
          modelValue.length !== 1 ? "s" : ""
        }}
      </p>

      <div
        v-for="item in modelValue"
        :key="item.id"
        class="group flex items-center gap-3 p-3 bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl hover:border-slate-300 dark:hover:border-slate-500 transition-colors"
      >
        <!-- Thumbnail / icon -->
        <div
          class="w-11 h-11 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex-shrink-0"
        >
          <img
            v-if="item.previewUrl"
            :src="item.previewUrl"
            class="w-full h-full object-cover"
            alt=""
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center bg-amber-50"
          >
            <i class="pi pi-file-pdf text-lg text-amber-600" />
          </div>
        </div>

        <!-- Editable name -->
        <input
          :value="item.studentName"
          @input="
            item.studentName = ($event.target as HTMLInputElement).value
          "
          type="text"
          placeholder="Nome do aluno"
          class="flex-1 min-w-0 px-3 py-1.5 bg-slate-50/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />

        <!-- Remove -->
        <button
          type="button"
          @click="removeItem(item.id)"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <i class="pi pi-times text-xs" />
        </button>
      </div>
    </div>
  </div>
</template>
