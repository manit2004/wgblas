CC = nvcc
BIN = bin

all: $(BIN)/ssymm

$(BIN):
	mkdir -p $(BIN)

$(BIN)/ssymm: ssymm.c ../../utils/helpers.h | $(BIN)
	$(CC) ssymm.c -o $(BIN)/ssymm -lcublas

clean:
	rm -rf $(BIN)
