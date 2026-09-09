CC = nvcc
BIN = bin

all: $(BIN)/alpha.dscal $(BIN)/dscal $(BIN)/stride.dscal

$(BIN):
	mkdir -p $(BIN)

$(BIN)/alpha.dscal: alpha.dscal.c ../../utils/helpers.h | $(BIN)
	$(CC) alpha.dscal.c -o $(BIN)/alpha.dscal -lcublas

$(BIN)/dscal: dscal.c ../../utils/helpers.h | $(BIN)
	$(CC) dscal.c -o $(BIN)/dscal -lcublas

$(BIN)/stride.dscal: stride.dscal.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.dscal.c -o $(BIN)/stride.dscal -lcublas

clean:
	rm -rf $(BIN)
