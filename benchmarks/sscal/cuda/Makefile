CC = nvcc
BIN = bin

all: $(BIN)/alpha.sscal $(BIN)/sscal $(BIN)/stride.sscal

$(BIN):
	mkdir -p $(BIN)

$(BIN)/alpha.sscal: alpha.sscal.c ../../utils/helpers.h | $(BIN)
	$(CC) alpha.sscal.c -o $(BIN)/alpha.sscal -lcublas

$(BIN)/sscal: sscal.c ../../utils/helpers.h | $(BIN)
	$(CC) sscal.c -o $(BIN)/sscal -lcublas

$(BIN)/stride.sscal: stride.sscal.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.sscal.c -o $(BIN)/stride.sscal -lcublas

clean:
	rm -rf $(BIN)
