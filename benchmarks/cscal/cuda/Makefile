CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/cscal

$(BIN):
	mkdir -p $(BIN)

$(BIN)/cscal: cscal.c $(HDRS) | $(BIN)
	$(CC) cscal.c -o $(BIN)/cscal -lcublas

clean:
	rm -rf $(BIN)
