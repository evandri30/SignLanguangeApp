import torch

# Cek apakah GPU tersedia
print("CUDA tersedia:", torch.cuda.is_available())

if torch.cuda.is_available():
    device = torch.device("cuda")
    print("Menggunakan GPU:", torch.cuda.get_device_name(0))
else:
    device = torch.device("cpu")
    print("Menggunakan CPU")


# contoh: inputs, labels = inputs.to(device), labels.to(device)