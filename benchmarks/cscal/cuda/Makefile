CC = nvcc
BIN = bin

all: $(BIN)/alpha.cscal $(BIN)/cscal $(BIN)/stride.cscal

$(BIN):
	mkdir -p $(BIN)

$(BIN)/alpha.cscal: alpha.cscal.c ../../utils/helpers.h | $(BIN)
	$(CC) alpha.cscal.c -o $(BIN)/alpha.cscal -lcublas

$(BIN)/cscal: cscal.c ../../utils/helpers.h | $(BIN)
	$(CC) cscal.c -o $(BIN)/cscal -lcublas

$(BIN)/stride.cscal: stride.cscal.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.cscal.c -o $(BIN)/stride.cscal -lcublas

clean:
	rm -rf $(BIN)
