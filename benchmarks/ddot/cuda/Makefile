CC = nvcc
BIN = bin

all: $(BIN)/ddot $(BIN)/stride.ddot

$(BIN):
	mkdir -p $(BIN)

$(BIN)/ddot: ddot.c ../../utils/helpers.h | $(BIN)
	$(CC) ddot.c -o $(BIN)/ddot -lcublas

$(BIN)/stride.ddot: stride.ddot.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.ddot.c -o $(BIN)/stride.ddot -lcublas

clean:
	rm -rf $(BIN)
