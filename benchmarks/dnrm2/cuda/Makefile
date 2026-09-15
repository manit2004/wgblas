CC = nvcc
BIN = bin

all: $(BIN)/dnrm2 $(BIN)/stride.dnrm2

$(BIN):
	mkdir -p $(BIN)

$(BIN)/dnrm2: dnrm2.c ../../utils/helpers.h | $(BIN)
	$(CC) dnrm2.c -o $(BIN)/dnrm2 -lcublas

$(BIN)/stride.dnrm2: stride.dnrm2.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.dnrm2.c -o $(BIN)/stride.dnrm2 -lcublas

clean:
	rm -rf $(BIN)
